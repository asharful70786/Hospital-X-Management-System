/**
 * scripts/seed.js  –  Full seeder with unique email fix
 * -------------------------------------------------
 * 1.  npm i -D @faker-js/faker
 * 2.  Add "seed": "node scripts/seed.js" to package.json
 * 3.  npm run seed
 * -------------------------------------------------
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

/* 📦  MODELS  – adjust import paths if yours differ */
import User               from '../Models/userModel.js';
import Staff              from '../Models/staff.js';
import Department         from '../Models/Department.js';
import Ward               from '../Models/Ward.js';
import Bed                from '../Models/Bed.js';
import Appointment        from '../Models/Appointment.js';
import DoctorAvailability from '../Models/doctorAvailability.js';
import DoctorLeave        from '../Models/DoctorLeave.js';
import LabReport          from '../Models/LabReport.js';
import Medicine           from '../Models/Medicine.js';
import Prescription       from '../Models/Prescription.js';
import InventoryItem      from '../Models/InventoryItem.js';
import PatientRecord      from '../Models/PatientRecord.js';
import Bill               from '../Models/Bill.js';

dotenv.config();

const usedEmails = new Set();
const makeEmail = () => {
  let email;
  do {
    email = faker.internet.email().toLowerCase();
  } while (usedEmails.has(email));
  usedEmails.add(email);
  return email;
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Hospital');
  console.log('🟢  MongoDB connected - cleaning up...');

  await Promise.all([
    User.deleteMany({}), Staff.deleteMany({}), Department.deleteMany({}),
    Ward.deleteMany({}), Bed.deleteMany({}), Appointment.deleteMany({}),
    DoctorAvailability.deleteMany({}), DoctorLeave.deleteMany({}),
    LabReport.deleteMany({}), Medicine.deleteMany({}), Prescription.deleteMany({}),
    InventoryItem.deleteMany({}), PatientRecord.deleteMany({}), Bill.deleteMany({})
  ]);

  const departments = await Department.insertMany(
    ['Cardiology','Neurology','Orthopedics','Pediatrics','Radiology'].map(name => ({
      name,
      description: `${name} Department`
    }))
  );

  const userDocs = [
    { name: faker.person.fullName(), email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'SuperAdmin' },
    { name: faker.person.fullName(), email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'Admin' },
    { name: faker.person.fullName(), email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'Receptionist' },
    ...Array.from({ length: 2 }).map(() => ({ name: faker.person.fullName(), email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'Pharmacist' })),
    ...Array.from({ length: 2 }).map(() => ({ name: faker.person.fullName(), email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'LabTech' })),
    ...Array.from({ length: 8 }).map(() => ({ name: faker.person.fullName(), email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'Nurse' })),
    ...Array.from({ length: 6 }).map(() => ({ name: `Dr. ${faker.person.fullName()}`, email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'Doctor' })),
    ...Array.from({ length: 25 }).map(() => ({ name: faker.person.fullName(), email: makeEmail(), phone: faker.phone.number('##########'), password: faker.internet.password(10), role: 'Patient' }))
  ];

  const users = await User.insertMany(userDocs, { ordered: false });
  console.table(users.reduce((m, u) => { m[u.role] = (m[u.role] || 0) + 1; return m; }, {}));

  const doctors  = users.filter(u => u.role === 'Doctor');
  const nurses   = users.filter(u => u.role === 'Nurse');
  const patients = users.filter(u => u.role === 'Patient');

  await Staff.insertMany(
    users.filter(u => u.role !== 'Patient').map(u => ({
      user: u._id,
      department: faker.helpers.arrayElement(departments)._id,
      role: u.role,
      isActive: true
    }))
  );

  const wards = await Ward.insertMany(['A','B'].map(letter => ({ name: `Ward-${letter}`, type: letter === 'A' ? 'General' : 'ICU', capacity: 10 })));
  await Bed.insertMany(wards.flatMap(ward => Array.from({ length: ward.capacity }).map((_, idx) => ({ ward: ward._id, bedNo: idx + 1, status: 'Available' }))));

  const meds = await Medicine.insertMany(Array.from({ length: 40 }).map(() => ({ name: faker.commerce.productName(), batch: faker.string.alphanumeric({ length: 8, casing: 'upper' }), expiry: faker.date.future({ years: 2 }), qty: faker.number.int({ min: 50, max: 400 }), unitPrice: faker.commerce.price({ min: 5, max: 250 }) })));

  await InventoryItem.insertMany(['Syringe','Gloves','Bandage','Saline','IV Set'].map(name => ({ name, qty: faker.number.int({ min: 200, max: 800 }), threshold: 25, unit: 'pcs' })));

  await DoctorAvailability.insertMany(doctors.map(doc => ({ doctor: doc._id, weekday: faker.number.int({ min: 1, max: 5 }), startTime: '09:00', endTime: '14:00' })));
  await DoctorLeave.insertMany(doctors.slice(0, 2).map(doc => ({ doctor: doc._id, from: faker.date.soon({ days: 10 }), to: faker.date.soon({ days: 12 }) })));

  const appointments = await Appointment.insertMany(Array.from({ length: 30 }).map(() => ({ patient: faker.helpers.arrayElement(patients)._id, doctor: faker.helpers.arrayElement(doctors)._id, date: faker.date.soon({ days: 15 }), time: faker.date.anytime().toTimeString().slice(0, 5), status: 'Scheduled' })));

  await Prescription.insertMany(appointments.map(appt => ({ patient: appt.patient, doctor: appt.doctor, medicines: Array.from({ length: 2 }).map(() => ({ medicine: faker.helpers.arrayElement(meds)._id, dose: faker.helpers.arrayElement(['1-0-1','0-1-1','1-1-1']), duration: faker.number.int({ min: 3, max: 7 }) })) })));

  await LabReport.insertMany(Array.from({ length: 12 }).map(() => ({ patient: faker.helpers.arrayElement(patients)._id, testName: `${faker.science.chemicalElement().name} Test`, resultUrl: faker.internet.url(), status: faker.helpers.arrayElement(['Pending','Completed']), reportedAt: faker.date.recent({ days: 5 }) })));

  await PatientRecord.insertMany(appointments.map(appt => ({ patient: appt.patient, doctor: appt.doctor, visitDate: appt.date, symptoms: faker.lorem.words(4), diagnosis: faker.lorem.words(2), prescriptions: [{ name: faker.commerce.productName(), dosage: '500 mg', frequency: '1-0-1', duration: '5 days' }], labReports: [], notes: faker.lorem.sentences(2) })));

  await Bill.insertMany(appointments.slice(0, 8).map(appt => ({ patient: appt.patient, amount: faker.commerce.price({ min: 500, max: 8000 }), services: ['Consultation'], status: faker.helpers.arrayElement(['Paid','Unpaid']), createdAt: new Date() })));

  console.log('✅  Database successfully seeded!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seeder crashed:', err);
  process.exit(1);
});
