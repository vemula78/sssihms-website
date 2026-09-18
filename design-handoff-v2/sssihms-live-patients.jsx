// sssihms-live-patients.jsx — For Patients cluster, full live content.
// Sources: /appointments-admission/, /treatment/, /facilities/
(function(){
const PAGES = window.PAGES;
const SUBNAV = window.DEPT_SUBNAV || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
SUBNAV.patients = [
  ['Treatments at SSSIHMS','treatment'], ['Appointments & Admission','appointments-admission'],
  ['Facilities','facilities'], ['Help Desk','help-desk']
];
window.DEPT_SUBNAV = SUBNAV;

const CONTACT = { type:'cards', eyebrow:'Contact', title:'Sri Sathya Sai Institute of Higher Medical Sciences', cols:2, alt:true, items:[
  { icon:'◆', title:'Address', desc:'EPIP Area, Whitefield, Bangalore 560 066, Karnataka, INDIA.' },
  { icon:'◆', title:'Telephone', desc:'080 47104600 — Help Desk (only for PATIENT ENTRY) · 080 2800 4600 — General Enquiry · 080 28004763 — College of Nursing · 080 2800 4640 — Academics · 080 2800 4641 — HR dept.' }
] };

// ── APPOINTMENTS & ADMISSION ────────────────────────────────────────────────
PAGES['appointments-admission'] = {
  title:'Appointments & Admission', crumb:'For Patients · Appointments & Admission', subnav:'patients',
  subtitle:'A general guide for patients who would like to avail the free medical care at SSSIHMS, Whitefield.',
  sections:[
    { type:'intro', eyebrow:'Appointments', title:'Welcome to SSSIHMS, Whitefield',
      image:U + '2015/05/02_Final_Hospita-.jpg', imageLabel:'Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield',
      body:[
        'Welcome to Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield. This hospital is a tertiary care institution that caters to the specialties of: Cardiology, Cardiothoracic and vascular surgery, Neurology and Neurosurgery.',
        'The following information is a general guide for patients who would like to avail the free medical care at Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield.'
      ] },
    { type:'features', eyebrow:'Please Note the Following', title:'Before You Come', alt:true, items:[
      'All medical service provided to patients of SSSIHMS Whitefield is totally free of charge.',
      'The hospital does not have a billing counter.',
      'The hospital strictly conforms to a first come first serve policy with provisions for emergency medical conditions.',
      'Patients and patient attenders are advised not to pay anyone who claims to be a staff member of SSSIHMS Whitefield, for any service whatsoever. Immediately bring such individuals to the notice of the Hospital Security.',
      'Patients seeking treatment here can call the Hospital Helpline number 080-47104600 for getting an appointment for OPD consultation at the Hospital.',
      'Due to current COVID situation, for safety of patients and staff, the hospital is requiring patients to come with negative RT PCR report.'
    ] },
    { type:'features', eyebrow:'Visiting Hours', title:'When Visitors May Come', items:[
      'The general visiting hours are from 4:00 pm to 6:00 pm.',
      'When outside visitors wish to see a patient, the attendant staying with the patient may approach the Security at gate I, leave his/her attendant pass with him, collect the Visitors\u2019 pass from Security, and proceed to the wards.',
      'After visiting the patients, the attendant can collect his/her pass after seeing off the visitors.'
    ] },
    { type:'features', eyebrow:'In-patient Attendants', title:'Attendant Passes', alt:true, items:[
      'For every in-patient one attendant has to remain on campus. He/she will be given the attendant pass by the respective ward sister.',
      'In the Neuro ward, during the rounds by the consultants and doctors the patient attendants are expected to be around.',
      'Additional attendants are allowed only if the patients are immobile, have any disability and need assistance for moving around or in any other case, as opined by the concerned doctor.',
      'Only under instructions from a doctor is an additional attendant pass issued.'
    ] },
    { type:'features', eyebrow:'Outpatient Consultation', title:'How Do I Register as a Patient?', items:[
      'Please bring all your previous medical records.',
      'Please bring a valid proof of address. The following proofs are accepted: Aadhar Card (preferred), Ration card, Voters ID, Driver\u2019s license, Passport — this is compulsory for all foreign nationals.',
      'One attendant is compulsory.',
      'You will first be screened to be a patient of either of the specialties offered by SSSIHMS and only then registered.'
    ] },
    { type:'prose', eyebrow:'What Procedure Should I Follow?', title:'From Appointment to OPD', alt:true, body:[
      '<strong>Appointment.</strong> The patient is required to call patient help desk 080-47104600 to get an appointment. Then will get an SMS with appointment date and timing.',
      '<strong>Gate No.2.</strong> At Gate No.2, you will need to show the appointment SMS to the security. You may then proceed to the Screening / Reception block.',
      '<strong>Screening / Reception block.</strong> Here you will be directed to the appropriate section — cardiac or neuro. The doctors will evaluate your condition and advise you accordingly. Once advised by the doctors in the screening block to approach the OPD, you may proceed to the appropriate OPD.',
      '<strong>Out Patient Department.</strong> As you enter the main hall of the hospital, the Cardiac OPD is to your left hand side and the Neuro OPD is across the hall on your right hand side. There will be volunteers at the entrance to guide you to the appropriate OPD.'
    ] },
    { type:'features', eyebrow:'Revisit Patients', title:'What Is the Procedure for Revisit Patients?', items:[
      'Come to the hospital only if you have been specifically advised to do so in your discharge summary.',
      'To avoid any eventualities, please check the date of your revisit on your discharge summary and make sure you come on that date.',
      'If any complications arise, for any reason you would like to visit the hospital, please call the hospital and confirm whether it is absolutely necessary for you to travel to the hospital.',
      'Patient Help Desk — 080-47104600'
    ] },
    { type:'features', eyebrow:'Inpatient Admissions', title:'On the Day of Admission', alt:true, items:[
      'On the date of admission you will be completely screened by the doctors.',
      'You will be admitted only after you are found fit for surgery.',
      'One attendant is compulsory.',
      'Bring all previous medical records — both records from other medical institutions and any medical records given to you by SSSIHMS.',
      'To avoid any inconvenience, make your travel arrangements such that you come to the hospital on the appointed day, before 8.30 a.m.'
    ] },
    { type:'prose', eyebrow:'Follow-up and Telemedicine', title:'Care After You Return Home', body:[
      'The department of telemedicine, SSSIHMS, Whitefield is part of the Sri Sathya Sai Tele-health Network that includes both the sister institutions at Prasanthigram and Whitefield.',
      '<strong>Need for Sri Sathya Sai Telehealth Network.</strong> India is a vast country with its population widely distributed over a diverse landscape. Modern health care is yet to make inroads to the majority of the populace residing in rural India. One thrust area in vogue is the field of Telemedicine. Due to the non-commercial nature of the treatment provided at SSSIHMS, the hospital receives patients from all over India and even from many SAARC countries like Nepal and Bangladesh. A large number of these patients are below poverty line and some cannot afford to even travel the distance to avail the free and quality services of SSSIHMS. The telemedicine facility at SSSIHMS aims at reaching out to these patients in their geographical areas providing both diagnosis and counseling without them having to traverse the distance and incur avoidable expense.',
      '<strong>Mission.</strong> The mission of the Sri Sathya Sai Telehealth Network is to leverage the potential of Information and Communication Technology (ICT) tools and extend the reach of quality medical care provided free of cost by Sri Sathya Sai Health System for patients requiring neurosurgical care.'
    ] },
    { type:'features', eyebrow:'Aims of the Project', title:'What the Network Seeks to Do', alt:true, items:[
      'Streamline the flow of revisit/Outpatients from pre-identified locations (States)',
      'Schedule appointments for face-to-face consultation and surgery',
      'Minimize unnecessary investigation, and travel for patients who can be advised remotely',
      'Provide follow up for post-operative patients',
      'Counseling of the patients',
      'Guide patients requiring support from other medical specialties presently not provided by SSSIHMS-WFD',
      'Conduct and participate in online CMEs, training of DNBs and exchange of best practices and expertise in neurosurgery'
    ] },
    { type:'prose', eyebrow:'Integration With Other Projects', title:'Scaling the Network', body:[
      'The scope of Sri Sathya Sai Telehealth Network can also be scaled to meet the referrals for neurosurgical support from sister institutions like SSSGH-Whitefield, SSSIHMS-Prasanthi Gram, Sri Sathya Sai Mobile Hospital and any other associated institutions. The possibility of integrating the telemedicine application provided by ISRO with the eHIS and PACS functional at SSSIHMS-Whitefield will enhance the scope of the project and will have an impact on the delivery of telehealth services positively.',
      'Through successful integration of telemedicine services in its routine clinical care, SSSIHMS expects to achieve a "right service mix" that is both timely and distance insensitive, ensuring maximum efficiency and effectiveness in optimal utilization of its resources.'
    ] },
    { type:'features', eyebrow:'Challenges Ahead', title:'What the Network Must Still Solve', alt:true, items:[
      'Creating awareness',
      'Training manpower on tele-health protocols',
      'Build suitable infrastructure/capacity',
      'Establish standard operating procedures',
      'Need for the SSSIHMS vision and principles to be shared by one and all across the network',
      'Sustainable operations',
      'Medico-legal implications in providing neurosurgery services through telemedicine',
      'Expanding the network all over India'
    ] },
    { type:'cards', eyebrow:'Nodal Point Locations', title:'Where Tele-Consultations Are Held', cols:2, items:[
      { icon:'◆', title:'West Bengal — Barrackpore', desc:'Sri Sathya Sai Seva Kendra, 1, Riverside Road (Beside Mangal Pandey Park), Barrackpore Cantonment, Barrackpore, North 24 Parganas, Pin 700120, West Bengal. Telephone: 033-25450329 · telemedbkp@gmail.com' },
      { icon:'◆', title:'Odisha — Bhubaneswar', desc:'Sri Sathya Sai Seva Samiti, Unit III, Kharavel Nagar (Opp. Nalini Devi Women\u2019s College of Teacher Education), Bhubaneswar, Odisha, Pin 769 010. Phone: 0674-2391090, 8895268090 · telemedbbsr@gmail.com' }
    ] },
    { type:'prose', eyebrow:'Who May Approach', title:'Consultation in Neuro and Cardiac Post-Operative Care', alt:true, body:[
      'Sri Sathya Sai Telehealth Network offers consultation in Neuro and Cardiac post operative care for patients operated at SSSIHMS.',
      'Patients who are diagnosed with such ailments, who have already consulted a doctor and have previous medical records (reports/scans) readily available, may approach the nodal center.'
    ] },
    CONTACT
  ]
};

// ── TREATMENTS ──────────────────────────────────────────────────────────────
PAGES['treatment'] = {
  title:'Treatment Offered at SSSIHMS, Whitefield', crumb:'For Patients · Treatments', subnav:'patients',
  subtitle:'Every procedure listed here is performed completely free of charge.',
  sections:[
    { type:'intro', eyebrow:'Cardiology', title:'Cardiac Catheterization',
      image:U + '2015/05/Patient-collage-e1432545265677.jpg', imageLabel:'Patients at SSSIHMS',
      body:[
        'Cardiac catheterization is a common diagnostic test performed to evaluate the condition of heart muscle, valves, and vessels. During this procedure, special long, flexible tubes, called angiography catheters, will be inserted into your heart and coronary arteries. Contrast media (also called dye) is injected through the angiography catheter while x-ray images are taken.',
        'The dye causes areas where blood flows, including vessels and heart chambers, to temporarily become darker than the surrounding tissue. This enables the physician to see how effectively your heart is pumping, and to determine if there are any narrowed blood vessels. Blood pressure measurements are also taken at this time.',
        'Unlike cardiac surgery, most of the cardiology procedures have common steps with the changes being in the selection of "the interventional triad": the Guiding Catheter, the Guide Wire and the Balloon (depending on the procedure). The basic process of cardiac catheterization remains the same.',
        'Diagnostics and procedures in Cardiology may be divided into two broad categories, arrhythmia related procedures and anatomy related procedures.'
      ] },
    { type:'prose', eyebrow:'Anatomy Related Diagnosis and Treatment', title:'Valve and Vessel Procedures', alt:true, body:[
      '<strong>Percutaneous Transluminal Mitral Commissurotomy (PTMC).</strong> PTMC is a procedure where a balloon is used to dilate a stenosed mitral valve by threading it onto a catheter that is maneuvered into the mitral valve site. The most beneficial and effective technique was developed by Inoue in 1982.',
      '<strong>PDA coil closure.</strong> A steel or MRI compatible metal coil is placed across the PDA to help in thrombotic closure — thrombus (clot) formation occurs on the metal coil and the PDA is sealed.',
      '<strong>Pulmonary Valve Balloon Dilatation (PVBD).</strong> This is done for pulmonary valvular stenosis. A balloon catheter is maneuvered into the pulmonary valve through a right heart catheterization procedure and is inflated (valve is dilated) in a single stage.',
      '<strong>Aortic Valve Balloon Dilatation (AVBD).</strong> This is done for aortic valvular stenosis. A balloon catheter is maneuvered into the valve through a left heart catheterization procedure and is inflated (valve is dilated) in a single stage.',
      '<strong>Coarctation of Aorta Dilatation.</strong> When there is a block in the aorta after the arch (thoracic or abdominal segments) obstructing the flow to the lower limbs of the body, a balloon is placed across this obstruction and inflated clearing the way for the blood to flow.',
      '<strong>Peripheral Angiogram.</strong> The standard angiogram procedure is performed for other vascular structures of the body under investigation for obstructions/anomalies.',
      '<strong>Pericardial Effusion Tapping (PE Tapping).</strong> A catheter is inserted through the intercostal spaces (between the ribs) into the pericardial sac and pre-calculated (excess) pericardial fluid is aspirated (removed) using a syringe. The position of catheter is confirmed using fluoroscopy and the liquid level is assessed using echocardiography.',
      '<strong>Percutaneous Transluminal Angioplasty (PTA).</strong> This is a generic name given to the interventional procedure that follows the angiogram. Angioplasty attempts to bring the vasculature back to normal through different means (stent, removal of plaque). This procedure can be done anywhere in the body and the name changes according to the location such as: Coronary, Renal, Abdominal, Sub-Clavian, Carotid, Iliac, Brachial, Femoral, etc.',
      '<strong>SAM Dilatation.</strong> More of a palliative procedure. A Sub Aortic Membrane, which is absent in a normal heart, causes obstruction to blood flow out of the Left Ventricle into the aorta. A balloon is inflated in the membrane area to suppress the growth so as to improve blood flow. It is generally considered not very effective. Surgery is the final option.',
      '<strong>Tricuspid Valve Balloon Dilatation (TVBD).</strong> Procedure similar to PTMC but the tricuspid valve is involved.',
      '<strong>Balloon Atrial Septostomy (BAS).</strong> This is a unique procedure to enable the mixing of pure and impure blood which enhances survival of the patient. This is normally done within one week to three months of birth generally for DTGA situations.'
    ] },
    { type:'prose', eyebrow:'Arrhythmia Related Diagnosis and Treatment', title:'Electrophysiology and Device Therapy', body:[
      '<strong>Electro-Physiological Study (EP Study).</strong> The normal heart beats according to the electrical impulses from the sinoatrial node to the atrioventricular node. Sometimes additional abnormal pathways form and cause dangerous changes to the normal rhythm of the heart (arrhythmias). EP study is a diagnostic procedure done to find out extra pathways that cause these arrhythmias.',
      '<strong>Radio Frequency Ablation (RF Ablation).</strong> This is a remedial procedure for arrhythmias. A special catheter is maneuvered into the position identified by the EP study to be the anomalous pathway and the tip of the catheter is heated through application of Radio Frequency to burn the extra pathways, preventing further arrhythmias (ablated).',
      '<strong>Temporary Pacemaker Implantation (TPI).</strong> A normal heart beats at a "pace" that causes the heart to eject blood into the aorta at the required pressure to circulate to the whole body. Due to various reasons the heart begins to slow down leading to a condition called bradycardia. Consequently the blood flow to the systemic circulation reduces (low cardiac output) leading to other complications. Temporary Pacemaker Implantation is a procedure wherein a catheter is positioned into the heart muscle and electrical impulses sent from an external pacemaker at the required pace to enable the heart to pump out its normal volume. This can be done under situations ranging from emergency interventions (accidents, organ failures, etc.) to procedural requirements in the Cath lab. In an emergency situation the TPI may itself suffice till the necessary action is taken and the heart returns to normal. Cath procedures requiring TPI include the process of Permanent Pacemaker Implantation (PPI); TPI is done to keep the heart beating normally till the PPI is completed.',
      '<strong>Permanent Pacemaker Implantation (PPI).</strong> When a TPI fails or the heart muscle is beyond salvage and cannot regain its original pace a PPI is performed. This is a semi-surgical procedure done in the Cath lab itself. Pacemaker is a little device implanted in the chest to regulate the heart rate and rhythm. Through a simple procedure the implantation is often done in the operation theatre or cardiac catheterization lab, and usually takes an hour or two.',
      'Pacemakers usually are implanted under local anesthesia; one will be relaxed, but awake, during surgery. Usually, pacemakers are implanted just under the skin in the upper chest. Typical complications for pacemaker implants are not life threatening, but may require a repeat operation or a longer than normal hospital stay. Common complications include bleeding, infection, lead dislodgment, and lead or pacemaker problems following surgery. Complications occur less than 1% of the time.',
      '<strong>Intra Cardiac Defibrillator Implantation.</strong> When the ventricles of the heart, especially the left one, beat on their own at a fast rate — e.g. 200 bpm as against the normal 120 bpm — it is called Ventricular Tachycardia. When this arrhythmia cannot be cured by ablation, the only other solution is to apply an electrical shock to bring it back to normal rhythm. Patients are implanted with a defibrillator that is programmed to sense this VT and "shock" it back to normal. The procedure for implantation is similar to that of the pacemaker but the instrument is a defibrillator instead of pacemaker.',
      '<strong>Biventricular Pacemaker Implantation.</strong> The left and right ventricles of a healthy heart pump out blood in a synchronized beat/rhythm. Some hearts do not have this synchronization, which leads to cardiac dysfunction and heart failure. To help such conditions, a special variety of pacemaker is implanted to bring the two ventricles back into sync and consequently improve the functioning of the heart.'
    ] },
    { type:'prose', eyebrow:'Coronary Related Diagnosis and Treatment', title:'Angiogram, Angioplasty and Septal Ablation', alt:true, body:[
      '<strong>Coronary Angiogram.</strong> Angiography (also called cardiac catheterization or a heart cath) is a common diagnostic test performed to evaluate the condition of heart muscle, valves, and vessels. This procedure is most commonly performed to determine a patient\u2019s cardiac condition and what form of treatment is required, including: medical management, angioplasty (PTCA, stenting or balloon widening of a vessel), or surgery.',
      '<strong>Percutaneous Transluminal Coronary Angioplasty (PTCA).</strong> This is a procedure in which a balloon is used to dilate blocked coronary arteries. This procedure has its advantages in that it postpones or avoids CABG surgery, but is limited to the extent of blockage. The process of atherosclerosis may be far too advanced in certain cases for the procedure to successfully restore blood flow. In such cases CABG/OPCAB are the available surgical options.',
      '<strong>Percutaneous Transluminal Angioplasty (PTA).</strong> This is a generic name given to the interventional procedure that follows the angiogram. Angioplasty attempts to bring the vasculature back to normal through different means (stent, removal of plaque). This procedure can be done anywhere in the body and the name changes according to the location such as: Coronary, Renal, Abdominal, Sub-Clavian, Carotid, Iliac, Brachial, Femoral, etc.',
      '<strong>Percutaneous Trans-Septal Myocardial Ablation (PTSMA).</strong> Each chamber of the heart has an optimal filling volume, which is in exact proportion to the other chamber volumes. When the Left Ventricular Volume is reduced, the carrying capacity/pumping volume also reduces, consequently the patient suffers secondary complications. This reduction in volume is sometimes due to septal thickening. PTSMA involves injecting alcohol into the vessel supplying the thickened part, which dies and becomes thin. LV volume increases.'
    ] },
    { type:'prose', eyebrow:'Cardiac Surgery', title:'Cardiac Surgical Procedures', body:[
      'Cardiac surgery consists of basically two types of procedures, Open heart and Closed heart, the former being done with the help of a heart lung machine and the latter without the need for a heart lung machine.',
      'The commonest open heart procedures include coronary artery bypass CAB (the commonest surgical procedure in the world today), valve replacements, aneurysm repairs and correction of congenital heart defects.',
      'In SSSIHMS, a majority of Coronary artery bypass procedures are done without the help of a heart lung machine (Off pump Coronary Artery Bypass — OPCAB) but with a fully assembled pump available, if needed.',
      'Majority of the valve procedures are replacements, with repairs accomplished when feasible. Aortic aneurysms, depending on their location, are treated appropriately, with valve conduits or grafts as indicated. Total correction procedures form a major part of the pediatric surgical procedures, with palliative closed procedures when indicated. Examples of closed heart surgery include PDA ligation, Bi-Directional Glenn, Blalock-Taussig shunt, Coarctation of Aorta repair, and so on.',
      'Following are the most common procedures done in the department of CTVS at SSSIHMS Whitefield.'
    ] },
    { type:'features', eyebrow:'CTVS Procedures', title:'The Most Common Procedures in the Department', alt:true, items:[
      'ALCAPA repair: Anomalous Left Coronary Artery Arising from Pulmonary Artery. This is a rare congenital anomaly where the Left Coronary Artery instead of arising from the aorta arises from the Pulmonary Artery. The surgical procedure involves re-implanting the left coronary artery back to the ascending aorta where it should have been arising, to start with.',
      'Aortic Root Replacement: A surgical procedure where both the aortic valve and the ascending aorta are replaced with artificial valve and graft and re-implantations of the coronary buttons into the prosthetic graft.',
      'AP Window closure: Aorto Pulmonary Window closure — a communication between ascending aorta and the pulmonary artery. Repair involves closure of this communication using a prosthetic or pericardial patch.',
      'ASD closure: Atrial Septal Defect — surgical closure of a defect in the septum/partition between the left and right atria, usually with a pericardial patch.',
      'AV canal repair: Atrio-Ventricular canal repair. This is a complex defect where not only are the valves incompletely formed, but the atrial and/or ventricular septae/partitions are also deficient. Repair consists of not only repairing the two valves but also reconstituting the septae.',
      'AVR: Aortic Valve Replacement, a procedure where the Aortic valve is replaced with a prosthetic (mechanical) / bio-prosthetic (tissue) valve.',
      'BD Glenn: Bidirectional Glenn — an initial procedure that improves the blood flow to lungs, by connecting the Superior vena cava to the right pulmonary artery, as a prelude to connecting the inferior vena cava to the main pulmonary / left pulmonary artery.',
      'Modified BT Shunt: Modified Blalock Taussig Shunt — a palliative procedure for many cyanotics with decreased pulmonary blood flow, Tetralogy of Fallot being the most common, where the subclavian artery is connected to the corresponding pulmonary artery using an appropriate sized artificial tube graft.',
      'CABG: Coronary Artery Bypass Graft — a procedure whereby blocked coronary arteries are bypassed using conduits from another part of the body (Left/Right Internal Mammary Artery from the chest wall, radial artery from the forearm and/or veins from the legs). The surgery is usually done without the help of a Heart lung machine using myocardial tissue stabilizers, called OPCAB, and in selective cases using cardio pulmonary bypass.',
      'CoA Repair: This is a condition where there is a narrowing (Coarctation) of the aorta usually occurring in the proximal thoracic aorta section. The surgery involves removing the narrowed segment and connecting the two ends of the aorta directly whenever possible, or by placing a prosthetic graft between the two aortic segments.',
      'Cor Triatriatum repair: An abnormal membrane in the Left Atrium that divides the LA into two chambers. The membrane is surgically removed during this procedure.',
      'DCRV repair: Double Chambered Right Ventricle — abnormal obstructing muscle bundles inside the Right ventricle that are surgically removed.',
      'DORV repair: Double Outlet Right Ventricle generally occurs with both the great arteries arising from the right ventricle. The repair consists of closing the ventricular septal defect such that the left ventricle pumps blood into the aorta and the right ventricle into the main pulmonary artery.',
      'Fontan: A procedure for congenital heart diseases with a functionally single ventricle where the systemic venous return is directly sent to the pulmonary circulation by detaching the SVC and the IVC and connecting them to the Pulmonary arteries. It is most often done without the use of heart lung machine, by using SVC-RA and IVC-RA shunts.',
      'Lung resection: A procedure for removal of tumors and cysts in the lungs.',
      'MV Repair: Mitral Valve Repair, where the mitral valve is surgically repaired.',
      'MVR: Mitral Valve Replacement, where the Mitral valve is surgically replaced with a prosthetic (artificial) / bio-prosthetic (tissue) valve. This is done only when the valve is beyond salvage and cannot be repaired.',
      'Myxoma excision: A surgical procedure where a myxoma — a connective tissue tumor usually found in the heart chambers — is excised (cut and removed). Commonly occurs in atria.',
      'PAPVC repair: Partial Anomalous Pulmonary Venous Connection repair. One or more of pulmonary veins drain into RA. Surgical correction involves closure of the associated ASD, routing the pulmonary vein/s to LA.',
      'PDA Ligation / Division: Patent Ductus Arteriosus Ligation/Division, a procedure in which the Patent Ductus Arteriosus, a connection between the pulmonary artery and the aorta, is ligated (tied) or divided (cut).',
      'Pericardiectomy: A surgical procedure for the condition of Pericarditis (infection of the pericardium) involving removal of the adhered pericardium.',
      'RSOV repair: Ruptured Sinus Of Valsalva repair — a condition where one of the cusps of aorta in the sinus of Valsalva ruptures (tears/opens up) into one of the right sided chambers of the heart. Repair involves closure of the rupture.',
      'SAM Excision: Sub Aortic Membrane excision, a surgical procedure on the aorta where a membrane below the aortic valve is obstructing the outflow of blood into the aorta.',
      'Supra Valvular Aortic Stenosis: Surgical repair of severe narrowing of the supra valvular portion of the ascending aorta.',
      'TAPVC repair: Total Anomalous Pulmonary Venous Connection repair — condition in which all the pulmonary veins drain into RA instead of LA. Surgical correction involves routing them to LA.',
      'TGA: Transposition of great arteries is a serious congenital condition where the aorta arises from the right ventricle and the pulmonary artery from the left ventricle leading to parallel systemic and pulmonary circulation. Senning\u2019s, Mustard are procedures at the atrial level, while Jatene\u2019s is an arterial switch operation with coronary transfer. These procedures are named after their founders.',
      'Thymectomy: A surgical treatment for the condition of Myasthenia Gravis which involves excision of the thymus gland. This is also done for tumors of the Thymus.',
      'T.O.F Repair: A surgical procedure performed for the Tetralogy of Fallot (TOF) condition (Ventricular Septal Defect, Pulmonary Stenosis, Right Ventricular Hypertrophy, Overriding Aorta); the VSD is closed and the Right Ventricular Outflow Tract (RVOT) is reconstructed/augmented.',
      'VSD closure: Ventricular Septal Defect — surgical closure of an abnormal opening in the septum/partition between the left and right ventricles. There are various types of VSD depending upon the position of the opening in the septum.'
    ] },
    { type:'features', eyebrow:'Neurology', title:'Neurological Conditions Evaluated and Treated Routinely', items:[
      'Face, head and neck pain',
      'Epilepsy and related conditions',
      'Cerebrovascular diseases',
      'Infections of the CNS',
      'Multiple Sclerosis (MS) and other demyelinating disorders',
      'Dementia',
      'Parkinson\u2019s Disease and movement and ataxic disorders',
      'ALS and Other Motor Neuron Diseases',
      'Trigeminal Neuralgia, Bell\u2019s Palsy, and Other Cranial Nerve Disorders',
      'Spinal Cord Diseases',
      'Peripheral Neuropathies including Guillain-Barré Syndrome',
      'Neuromuscular diseases',
      'Tumors of the Nervous System',
      'Psychiatric disorders and Mental health problems'
    ] },
    { type:'prose', eyebrow:'Neurology in Detail', title:'How Each Group of Conditions Is Managed', alt:true, body:[
      '<strong>Face, Head and Neck pain.</strong> These patients are generally managed on OPD basis: Atypical Facial Pain, Cervical Spondylosis, Migraine and other headaches and variants, Muscle Contraction Tension Headache, Chronic Back Pain, Post-herpetic Neuralgia, Trigeminal Neuralgia.',
      '<strong>Epilepsy and related conditions.</strong> These patients are investigated as required and treatment instituted. Some patients depending upon their condition are admitted as part of their management: fits, black outs, jerks and faints; non-epileptic attacks; sleep disorders.',
      '<strong>Cerebrovascular diseases.</strong> Acute cases are admitted and managed with anti-coagulants and physiotherapy. Chronic cases are evaluated as required: Acute Stroke Management, Cerebral Venous Thrombosis, TIA (Transient Ischemic Attack).',
      '<strong>Infections of the CNS.</strong> These patients are managed following diagnosis of the infections based on lumbar puncture and other investigations, with admission and institution of appropriate anti-microbial therapy: meningitis — acute and chronic, bacterial/viral/protozoal/fungal; encephalitis; brain abscess.',
      '<strong>Multiple Sclerosis (MS) and other demyelinating disorders.</strong> Optic Neuritis, Transverse Myelitis, other demyelinating disorders.',
      '<strong>Dementia.</strong> These patients are investigated: Alzheimer\u2019s disease, vascular dementia / multi-infarct dementia, reversible dementias, prion disease (Creutzfeldt-Jakob and Gerstmann-Sträussler-Scheinker disease).',
      '<strong>Parkinson\u2019s Disease and movement and ataxic disorders.</strong> These patients are seen on an OPD basis and treatment is instituted and optimized as required: dystonia, tremors, Parkinson Disease and related disorders, spinocerebellar ataxias.',
      '<strong>ALS and Other Motor Neuron Diseases.</strong> ENMG and conduction studies are used to reach a definitive diagnosis in these patients: amyotrophic lateral sclerosis / MND, spinal muscular atrophy.',
      '<strong>Trigeminal Neuralgia, Bell\u2019s Palsy, and Other Cranial Nerve Disorders</strong> are investigated and treated appropriately.',
      '<strong>Spinal Cord Diseases.</strong> When surgical intervention is required then the patients are referred to the sister department of neurosurgery: myelopathy, spinal cord tumors, cervical spondylosis, prolapsed disc, transverse myelitis.',
      '<strong>Peripheral Neuropathies including Guillain-Barré Syndrome.</strong> ENMG, NCV and nerve biopsies are conducted for diagnosis: polyneuropathies e.g. diabetic; acute neuropathies e.g. GB Syndrome.',
      '<strong>Neuromuscular diseases.</strong> These are investigated by ENMG and muscle biopsy: dermatomyositis/polymyositis, inclusion body myositis, limb-girdle muscular dystrophy, metabolic myopathies, periodic paralyses.',
      '<strong>Tumors of the Nervous System.</strong> These, once diagnosed, are dealt with by the Neurosurgery department. <strong>Psychiatric disorders and mental health problems:</strong> psychiatric problems when secondary to neurological disorders, if diagnosed, are treated in-house by a Consultant Psychiatrist.'
    ] },
    { type:'prose', eyebrow:'Neurosurgery', title:'Cranial Surgery Procedures', body:[
      '<strong>Excision of Cranial and Spinal Arterio-Venous Malformations (AVMs).</strong> These are complex surgeries aimed at removing malformed conglomeration of blood vessels that parasitize the brain\u2019s blood supply. The operation involves meticulous dissection around the tumour-like growth of abnormal blood vessels and removal in toto. Similar AVMs in the spinal cord require greater expertise; however the procedure involved is similar to the one described above.',
      '<strong>Clipping of aneurysms.</strong> Intracranial aneurysms are out-pouchings of blood vessels, similar to a balloon. These may burst causing life threatening sub-arachnoid haemorrhage. We are equipped with the facilities to perform "clipping" of these aneurysms in any location in the brain after performing a digital subtraction angiogram (DSA). Clipping means that the aneurysm is removed from the circulation by application of a clip at its base.',
      '<strong>Surgery for giant aneurysms under CPB.</strong> For certain aneurysms which are located in exquisite areas or are giant in size, clipping as described above may not be feasible. In such cases, the help of the Cardiac surgery team is sought to perform a Cardio Pulmonary Bypass and temporarily block the blood flow to the site of the aneurysm. This is done by cooling the patient to profound hypothermia conditions and initiating Total Circulatory Arrest. The window of opportunity is around 30 minutes within which the clipping has to be accomplished. This expertise is available in only a handful of centers around the world.',
      '<strong>Dural AV fistula (DAVF).</strong> DAVFs are rare anomalies which may be managed with either open surgery or interventional procedures. At SSSIHMS a variety of operative strategies are employed in an attempt to disconnect the abnormal communication between an artery and a vein.',
      '<strong>Excision of Cavernomas.</strong> Cavernomas are mulberry shaped overgrowth of intracranial small blood vessels, which may bleed. They may be located in almost any part of the brain or spinal cord. Great care has to be exercised in removal of these lesions which may be small and may be located in eloquent regions of the brain or at great depth. Sophisticated surgical aids like a neuro-navigation system are often employed to reach the lesion and remove it without damaging the surrounding brain tissue.',
      '<strong>Trigeminal Neuralgia.</strong> This is a painful condition involving the face where the patient presents with unbearable, episodic, shooting pain in a particular portion of his/her face. The offending structure is usually a loop of an intracranial blood vessel which irritates the nerve conducting sensation from that portion of the face. Surgery is very gratifying and involves separating these two structures under the operating microscope.',
      '<strong>Intracranial gliomas.</strong> These are brain tumours which may range from benign to malignant high grade tumors (Grade I to Grade IV). Depending on its location, size and patient condition, the surgical strategy is planned for tackling each tumor.',
      '<strong>Acoustic tumors (Vestibular schwannoma).</strong> These are common tumors arising from the nerve responsible for conducting the sound from the ear. Unfortunately even in this day and age, the patients seen at SSSIHMS present at a late stage with some even losing vision and almost all tumors being extremely large in size.',
      '<strong>Meningiomas.</strong> Meningiomas are benign tumors arising from the covering of the brain and spinal cord. Depending on its location, the surgical approach is planned.',
      '<strong>Complex cranial base tumors.</strong> Cranial base surgery is a sub specialty in neurosurgery which is oriented towards the approach of lesions located at areas in the brain where routine surgical approach may not be successful.',
      '<strong>Pituitary tumors.</strong> The pituitary gland, which has been described as the master gland in the human body, may be home to a variety of tumors, some of which may present with mass effect (visual deterioration, neurological symptoms) and others with endocrinological symptoms. Trans-nasal, trans-sphenoidal approach is used commonly to operate these tumors, i.e. the surgeon operates on the pituitary gland through the nose. Other larger tumors may require an intracranial approach.',
      '<strong>Skull tumors.</strong> A variety of primary and secondary skull tumors are seen. Surgery involves removal of the tumor and reconstructing the bone defect.',
      '<strong>Intracranial metastasis.</strong> The brain is a common site for the lodging of cancer deposits from primary malignancies elsewhere in the body. Sometimes the location of the primary may elude detection.',
      '<strong>Intraventricular tumors.</strong> The ventricles of the brain are cavities filled with the cerebrospinal fluid. A whole range of tumors, from the most innocuous to the most malignant, may be harboured within the ventricles. By virtue of its location, the approach has to be planned in great detail before embarking on surgery.'
    ] },
    { type:'prose', eyebrow:'Pediatric Neurosurgery', title:'Tumours and Developmental Disorders in Children', alt:true, body:[
      '<strong>Posterior Fossa tumors.</strong> These are the commonest location for tumors in children. Medulloblastomas and ependymomas are the commonest pathologies noted.',
      '<strong>Optochiasmatic / hypothalamic tumors.</strong> These tumors arise from the optic pathway and hypothalamus. Therefore apart from vision, they may present with hypothalamic disturbance.',
      '<strong>Craniopharyngiomas.</strong> They are common childhood tumors located in the portion of the brain above the pituitary gland. Of uncertain etiology, they may prove to be a surgical challenge to remove in toto.',
      '<strong>Pineal tumors.</strong> The pineal gland is located in the geometrical centre of the cranial cavity. This innocuous structure has unknown and mysterious functions.',
      '<strong>Chiari malformation.</strong> The hind brain may protrude downwards causing symptoms. Treatment involves removing a portion of the skull, creating greater space and shrinking the cerebellar tonsils in an effort to alleviate symptoms.',
      '<strong>Encephalocoele.</strong> These are out-pouchings of portions of the covering of the brain in areas deficient of bone. Some may have significant amount of brain tissue contained within them.',
      '<strong>Hydrocephalus.</strong> This refers to a collection of excess fluid within the ventricular system. Treatment involves placing an alternative conduit for draining this fluid. This is achieved by inserting a shunt, one end of which is within the ventricular cavity, and the other end is in the abdominal cavity. An alternative procedure is to endoscopically open the floor of the third ventricle to internally drain the fluid.',
      '<strong>Spinal Dysraphism repair.</strong> These are abnormalities in the development of the spine and spinal cord. Surgery involves appropriate planning to achieve the most optimal results.',
      '<strong>CVJ (Craniovertebral junction) anomalies.</strong> These are complex clinical conditions involving the transitional region between the brain and spinal cord. Surgery may involve two procedures, one performed through the mouth and another in the back to place an implant.'
    ] },
    { type:'prose', eyebrow:'Spinal Surgery Procedures', title:'Degenerative Spinal Conditions, Tumours and Infection', body:[
      '<strong>Lumbar Spondylosis</strong> — micro lumbar discectomy, laminectomy. Lumbar disc disease is one of the most common conditions encountered in the clinic. If non-operative measures fail, surgery is offered. Surgery is done with the help of an operating microscope or with the endoscope. The surgery involves removal of the disc material and decompressing the compressed nerve roots.',
      '<strong>Lumbar Spondylolisthesis</strong> — pedicle screw fixation, PLIF (posterior lumbar instrumentation and fusion), ALIF (anterior lumbar instrumentation and fusion). Lumbar spondylolisthesis means a slip of one vertebra over another. Correction involves realignment with the help of titanium alloy screws and rods and bony fusion.',
      '<strong>Cervical Spondylosis</strong> — anterior cervical discectomy, laminectomy, laminoplasty, corpectomy and instrumentation, lateral mass plate or screw fixation. <strong>Cervical Spondylolisthesis</strong> — anterior and posterior fusion.',
      'Similar to lumbar disc disease, the cervical or uppermost portion of the vertebral column may also degenerate. One or two levels of disc protrusion and cord compression are treated by removing the offending disc and fusing that level by interposing a bone chip in the space. For two or more level involvement, the disc spaces concerned and the intervening vertebral body are removed and a large bone graft placed, reinforced by placing a plate and screws (corpectomy). A larger level of involvement requires either removal of the back portion of the vertebrae (laminectomy), which may be aided by placing screws through the lateral masses. Sometimes laminectomy may be inappropriate and here the back portion of the vertebrae may be opened out (laminoplasty).',
      '<strong>Thoracic Disc Disease</strong> — laminectomy, discectomy. Similar to cervical and lumbar degenerative disc disease, the thoracic vertebrae may also degenerate, though less frequently. However, the approach for these locations is more complex because of the lungs and heart located in front of them.',
      '<strong>Spinal Tumors</strong> — intramedullary (glioma, ependymoma), IDEM (intra-dural extramedullary tumour), vertebral bony lesions. Spinal tumors require gentler handling and precision. They may range from benign IDEM which originate from either the nerve roots or from the coverings, to tumors arising from the neural tissue itself.',
      '<strong>Spinal Infection</strong> — tuberculosis, pyogenic spinal infections. Tuberculosis infection of the spine may require surgery because of the compression of the neural structures by the pus or destroyed bony elements. Surgery is followed by anti-tuberculosis chemotherapy for a course of one and a half years.'
    ] },
    { type:'prose', eyebrow:'Other Neurosurgical Procedures', title:'Stereotaxy, Intracranial Infections and Peripheral Nerve Surgery', alt:true, body:[
      '<strong>Stereotactic procedures</strong> — biopsy, drainage of abscess/cyst, placement of reservoirs. Stereotaxy is a technique which uses the Cartesian coordinates to precisely localize any portion within the cranial cavity. This is helpful in performing surgeries for conditions located deep within the brain.',
      '<strong>Intracranial Infections</strong> — cardiogenic intracranial abscesses, otogenic abscesses. Intracranial abscesses are decreasing in occurrence because of better medical facilities. However at SSSIHMS, because of a large cardiac department, brain abscesses secondary to congenital heart disease are seen very often. Emergency surgery is done to remove the pus. Apart from heart conditions, infections anywhere in the body like ear, tooth etc. may spread to the brain.',
      '<strong>Peripheral nerve surgery</strong> — carpal tunnel syndrome, ulnar nerve release. Peripheral nerve surgery involves operating on the nerves which come out of the spinal cord. One of the commonest procedures it involves is decompressing the median nerve at the wrist by opening out the carpal tunnel through which it passes.'
    ] },
    { type:'features', eyebrow:'Ophthalmology', title:'Scope of Work', items:[
      'Routine refractive errors: screening and examination of refractive errors is performed and suitable glasses are prescribed.',
      'Medical retina: screening, laser treatment, intravitreal injections for diabetic retinopathy / retinal vein occlusions / age related macular degeneration.',
      'Surgical retina: retinal detachment surgery, diabetic vitrectomies, macular surgeries (ERM, macular hole, VMT), intraocular foreign body removal.',
      'Glaucoma: diagnosis, medical/surgical management of primary and secondary glaucomas — Humphrey visual field testing, laser peripheral iridotomy, trabeculectomy, combined cataract and trabeculectomy surgery.',
      'Cataracts: senile cataract, traumatic cataract, complicated cataract, subluxated and dislocated lens, pediatric cataract, secondary intraocular lens implantation.',
      'Anterior segment: diagnosis and management of infections and inflammatory conditions of conjunctiva and cornea, conjunctival/corneal trauma.',
      'Neuro-ophthalmology: complete neuroimaging facilities like CT and MRI scanning are available. Retinal nerve fiber layer analysis and ganglion cell layer analysis are done.',
      'Paediatric ophthalmology and strabismus: congenital cataract surgery, strabismus evaluation and management (surgical and non-surgical).'
    ] },
    { type:'prose', eyebrow:'Obstetrics and Gynaecology', title:'Services Offered', alt:true, body:[
      'Services offered include normal deliveries, episiotomies, Caesarean section, assisted breech deliveries, assisted twin deliveries, retained placenta, forceps deliveries, cervical cautery, dilatation & curettage, suturing cervical tear, examination under anaesthesia, ectopic pregnancies, tubectomy in certain cases, cervical cytology (pap smear), hysterectomies (both abdominal & vaginal), Caesarean hysterectomy, laparotomies, removal of ovarian cysts etc.'
    ] },
    { type:'features', eyebrow:'Orthopedics', title:'The Orthopedic Department Does the Following Surgeries on a Regular Basis', items:[
      'Total joint replacements',
      'Arthroscopic surgeries of knee, shoulder, ankle, elbow, hip and wrist',
      'Spine',
      'Complex deformity corrections',
      'Trauma including pelvic and acetabular',
      'Neglected trauma',
      'Benign bone tumors and cysts'
    ] },
    { type:'features', eyebrow:'Pediatrics', title:'Pediatric Services', alt:true, items:[
      'OPD services for common pediatric problems',
      'Post delivery care of the neonates',
      'Pediatric ward, equipped with 3 infant warmers, 4 LED phototherapy units, infusion and syringe pumps, multipara monitor, nebulizers, CPAP machine, central oxygen and air lines',
      'Developmental clinic: all children are screened and intervention given to needy',
      'Retinopathy of Prematurity (ROP) screening for all premature babies by retinal specialist',
      'Counseling and education at group and individual level for nutrition and hygiene, breast feeding, and general care of babies',
      'Routine immunization of the children'
    ] },
    { type:'cards', eyebrow:'ENT', title:'Consultation, Diagnosis and Treatment', cols:2, items:[
      { icon:'◆', title:'Services available', desc:'Ear conditions · Nose conditions · Throat conditions · Neck swellings · Chronic dacryocystitis · Foreign body in Ear, Nose and Throat' },
      { icon:'◆', title:'Services not available', desc:'Audiological tests · Hearing aid trials · Cochlear implants · Bronchoscopies · Oncosurgeries · Extensive skull base tumours' }
    ] },
    { type:'features', eyebrow:'Dental Department', title:'Services in Dental Specialty', alt:true, items:[
      'Root canal treatment',
      'Tooth extraction',
      'Fillings',
      'Scaling',
      'Orthodontic treatments',
      'Aesthetic fillings',
      'Detailed dental clearance for surgery cases'
    ] },
    { type:'cards', eyebrow:'General Medicine and General Surgery', title:'Two More Departments', cols:2, items:[
      { icon:'◆', title:'General Medicine', desc:'Routine General Medicine OPD consultation and treatment is done.' },
      { icon:'◆', title:'General Surgery', desc:'The following laparoscopic and open surgeries on a regular basis: hernia, hydrocele, appendix, intestinal perforation, wound debridement.' }
    ] },
    CONTACT
  ]
};

// ── FACILITIES ──────────────────────────────────────────────────────────────
PAGES['facilities'] = {
  title:'Facilities', crumb:'For Patients · Facilities', subnav:'patients',
  subtitle:'General information about the facilities in and around the hospital.',
  sections:[
    { type:'intro', eyebrow:'Facilities', title:'Welcome to SSSIHMS, Whitefield',
      image:U + '2015/04/aerial3.jpg', imageLabel:'Aerial view of the hospital campus',
      body:[
        'Welcome to Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield. This hospital is a tertiary care institution that caters to the specialties of: Cardiology, Cardiothoracic and vascular surgery, Neurology and Neurosurgery.',
        'Given below is general information about various facilities in and around the Hospital.'
      ] },
    { type:'features', eyebrow:'How to Reach', title:'Getting to the Hospital', alt:true, items:[
      'The Hospital is around 40 kms from the Bangalore International Airport, 10 kms from HAL airport, and 24 kms from the Railway & Bus station of the city: Kempegowda bus station, locally called "Majestic bus stop".',
      'Taxicab services are available from both the airport and the railway station. Prepaid autorickshaw service is available at the railway station.',
      'Volvo air-conditioned public transport service "BIAS" (Bangalore International Airport Service) is available from the Airport to Sri Sathya Sai Baba Ashram, Kadugodi. SSSIHMS is 5 kilometers from Kadugodi — by public transport / taxi / autorickshaw.',
      'Volvo A/c and regular public transport services are available to and from Kempegowda Bus Stop.'
    ] },
    { type:'features', eyebrow:'From Kempegowda Bus Stop Towards SSSIHMS', title:'Bus Routes (all from Platform No. 17)', items:[
      '304 J — Channasandra / ITPL',
      '326 E — Hosakote / Hope Farm',
      '319 C — Kadugodi / Hope Farm',
      '334 J — Kadugodi / Hope Farm',
      '304 H — Hope Farm / ITPL',
      '319 F — SSSIHMS',
      '333 E — Whitefield Rly. Stn. / Hope Farm',
      '333 H — Kadugodi / Hope Farm',
      '109 — Whitefield Rly. Stn. / Hope Farm',
      '335 H — Kadugodi'
    ] },
    { type:'features', eyebrow:'From Shivaji Nagar Towards SSSIHMS', title:'Bus Routes From the Cantonment Side', alt:true, items:[
      'Cantonment Railway station is another hub in Bangalore city which is very close to Shivajinagar Bus station. Passengers alighting from trains coming via this railway station may utilize the following route numbers.',
      '331 — Brindavan / ITPL or Hope Farm — Platform B3',
      '331 E — Belthur / Hope Farm — Platform A1',
      '301 — Channasandra / Hope Farm — Platform D3',
      'Depending on the bus route taken: one may alight right in front of SSSIHMS (335H); or alight at Pattandura Agrahara / ITPL and reach SSSIHMS after a 10-minute walk or by autorickshaw; or, alighting at Hope Farm, take a bus to ITPL / Pattandura Agrahara and either walk to SSSIHMS or use an autorickshaw.'
    ] },
    { type:'prose', eyebrow:'Food Court', title:'Canteen and Bakery on Campus', body:[
      'The hospital has a low cost canteen service for doctors, staff, students, patients and patient attendants on campus which is run by Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Welfare Society. The Welfare Society also runs a bakery service for benefit of staff and patients.',
      'Canteen coupons are available in the coupon counter, opened during the canteen serving hours. In-patient attendants are encouraged to purchase coupons in bulk to avoid crowding the coupon counter during the peak hours. The breakfast counter closes by 9 AM, after which breakfast is served in the Bakery.',
      '<strong>Canteen timings.</strong> Breakfast: 7:30 am – 9:00 am (in General Canteen). Lunch: 12:30 pm – 2:00 pm. Afternoon tea/snacks: 4:00 pm – 5:30 pm. Dinner: 7:30 pm – 8:30 pm.',
      '<strong>Bakery timings.</strong> 9:30 am – 12:30 pm and 2:30 pm – 9:00 pm. All items are sold at MRP. All purchases have to be made in cash; canteen coupons are not valid in the bakery.',
      'Apart from this there are several other eating options available outside the Hospital, including the food court in Inorbit Mall.'
    ] },
    { type:'features', eyebrow:'Eating Options Outside the Hospital', title:'Nearby Restaurants and Bakeries', alt:true, items:[
      'Hyderabad Cuisine — after Manthra Restaurant, Brookfield; 11:00–4:00 and 6:30–11:00; 9986341029 / 080-41162811 / 080-41162611; veg and non-veg',
      'Annapurna, Bengali cuisine — before Big Bazaar, after SSSIHMS; 7:00 am – 10:00 pm; veg and non-veg',
      'Big Bazaar — beside ITPL; 11:00 am – 11:00 pm',
      'Booming Bakery & Sweets — before Big Bazaar, after SSSIHMS; 6:00 am – 10:30 pm',
      'Cauvery Bakery — Aviva Junction; 5:00 am – 10:00 pm',
      'Fruit Mandi — after Manthra Restaurant, Brookfield',
      'Hotel Hansika, Andhra style — before Big Bazaar, after SSSIHMS; 12:00 – 10:30; veg and non-veg',
      'Hotel Sri Manjunatha — before Big Bazaar, after SSSIHMS; 7:00 am – 10:30 pm',
      'Lulu Bakery — before Big Bazaar, after SSSIHMS; 6:00 am – 11:30 pm',
      'Manjunatha Hotel — Aviva Junction; 7:00 am – 10:00 pm; 41693252',
      'Manthra Restaurant — after Cosmopolitan Mall',
      'Milk Booth — after Manthra Restaurant, Brookfield',
      'Mini Bakery — near Andhra Spice, after Cosmopolitan Mall',
      'Muthappan Bakery — Aviva Junction',
      'Nandini Andhra style — after Manthra Restaurant, Brookfield; 11:30–4:00 and 7:00–10:30; veg and non-veg',
      'R.K. Fast Food — lane in front of SSSIHMS, near Bus Depot; 6:30 am – 9:30 pm; vegetarian',
      'Rasam\u2019s Andhra Cuisine — Whitefield; 12:00 – 3:00 pm and 7:00 pm – 10:00 pm; 080-64552602',
      'Shiv Sagar — in front of ITPL; 7:00 am – 10:00 pm; vegetarian',
      'Sri Krishna Bakery — in front of ITPL; 6:00 am – 10:00 pm',
      'Sri Sathya Sai Bakery — Aviva Junction; 6:00 am – 10:00 pm; 080-41142129',
      'Only One — Kundalahalli village; 12:30 pm – 11:00 pm; 080-64542211, 080-64543311'
    ] },
    { type:'features', eyebrow:'Accommodation', title:'Sai Salarpuria Dormitory', items:[
      'Sai Salarpuria Dormitory is a low cost dormitory facility for patient attendants of admitted patients.',
      'The male/female attendants of the patients admitted in the Hospital are permitted to stay in the Salarpuria Block on payment of Rs. 20/- per day.',
      'The receipt for the Salarpuria block can be collected after paying the money in the Administration block between 2:00 pm and 4:00 pm.',
      'Attendants who are unable to collect the receipt can pay the money to the In-charge of the Salarpuria block. This has to be regularized on the next working day.',
      'Mat and blanket is provided to all the patient attendants in the Salarpuria block.',
      'The date on the receipt includes night stay.',
      'Apart from the stay, patient attendants are advised not to pay money under any other circumstances (especially during festivals).',
      'Dhobi facility is arranged in the Salarpuria Block on payment basis.',
      'Patients have to show the admission slip before paying for stay as this facility is provided only for the relatives of the inpatients.',
      'Relatives can relieve one another and the pass can be exchanged.'
    ] },
    { type:'cards', eyebrow:'Cloak Room and Railway Concession', title:'Two More Facilities', cols:2, alt:true, items:[
      { icon:'◆', title:'Cloak Room', desc:'Timings: 7:30 am to 7:30 pm. Patient attendants are advised not to keep any valuables in the cloak room. In-patients and their attendants can also keep their luggage in the Salarpuria Block. The Administration is not responsible for any loss from the cloak room or the attendant\u2019s hostel.' },
      { icon:'◆', title:'Railway Concession', desc:'Travel concession is provided at the time of discharge to only those patients who undergo cardiac surgery and interventional cardiac catheterization. Details of this procedure can be obtained from the Sister in charge at the Coronary Care Unit (CCU). Patients who undergo neurosurgery (for cancerous brain tumours only) are eligible for travel concession.' }
    ] },
    { type:'features', eyebrow:'Prohibited Items for Entry', title:'What May Not Be Brought Onto Campus', items:[
      'Cigarettes, beedi or any other smoking items',
      'Match box, cigarette lighter or any other fire producing items',
      'Tobacco, pan parag, gutka or any other littering items',
      'Alcoholic drinks',
      'Knife, scissors',
      'Inflammable materials',
      'Non-vegetarian food items',
      'Outside food except for children'
    ] },
    CONTACT
  ]
};
})();
