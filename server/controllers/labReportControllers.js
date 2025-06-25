import LabReport from "../Models/LabReport.js";

export const getAllLabReports = async (req, res) => {
  try {
    const labReports = await LabReport.find();
    res.json(labReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//this  will only access by the user who's is it 
// condition apply  soon 
export const patientLabReportAccess = async (req, res) => {
  //i have to modify this logic for ptient and admin / receptionist
  try {
    const labReport = await LabReport.findById(req.params.id);
    res.json(labReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//only bny receptionist
export const addlabReport = async (req, res) => {
  try {
    const newItem = new LabReport(req.body);
    await newItem.save();
    //i can add send mobile  or email sms  after the lapreport is Complete
    //using twilio api or nodemailer api
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//by super admin
export const updateLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLabReport = await LabReport.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedLabReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only deleted by super admin
export const deleteLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLabReport = await LabReport.findByIdAndDelete(id);
    res.json(deletedLabReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}