// sssihms-services-physiotherapy.jsx — Department of Physiotherapy, full live content.
// Source: https://whitefield.sssihms.org/physiotherapy/
(function(){
const PAGES = window.PAGES;
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const IMG = {
  equipment: U + '2015/06/Swami-Blessing-physiotheraphy-equipment.jpg',
  lamp: 'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/lighting-lamp-close-up.jpg',
  aerial: U + '2015/04/aerial3.jpg',
  dome: U + '2015/04/dome-tp1.jpg',
  diwali: U + '2015/05/Diwali-hospital-picture-e1430890195276.jpg'
};

PAGES['physiotherapy'] = {
  title:'Department of Physiotherapy', crumb:'Departments · Services · Physiotherapy', subnav:'services',
  subtitle:'The Physiotherapy Department at SSSIHMS mainly caters to inpatient services.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Restoring Strength and Movement',
      image:IMG.equipment, imageLabel:'Swami Blessing physiotherapy equipment',
      body:[
        'Physiotherapy is used to help restore or increase strength and movement in joints that have been affected by pain, injury or stroke. It is also used to reduce pain, inflammation and muscle spasm. Stroke, arthritis, fractures, and nerve lesions (damage) are also common conditions treated.'
      ] },
    { type:'features', eyebrow:'Conditions Treated', title:'Some of the Conditions Physical Therapists Manage', alt:true, items:[
      'Back and neck pain.',
      'Spinal and joint conditions, such as arthritis and Rheumatoid Arthritis.',
      'Biomechanical problems and muscular control.',
      'Problems affecting children, such as cerebral palsy and spinal bifida.',
      'Heart and lung conditions, such as chronic obstructive pulmonary disease (COPD) and pneumonia.',
      'Sport-related injuries.',
      'Stress incontinence.',
      'Neurological conditions: Stroke, Multiple Sclerosis, Parkinson’s disease and Paraplegia'
    ] },
    { type:'prose', eyebrow:'Types of Physiotherapy offered at SSSIHMS', title:'Inpatient Services',
      body:[
        'Please note that the physical therapy programs offered at the SSSIHMS WFD are for inpatients only.',
        '<strong>Electrotherapy:</strong> Interferential therapy, Ultra sound therapy, Shortwave diathermy, Microwave Diathermy, Transcutaneous Electrical Nerve Stimulator.',
        '<strong>Exercise therapy:</strong> Therapeutic exercises, Relaxed passive movements, Postural Drainage, Therapeutic massage.'
      ] },
    { type:'prose', eyebrow:'Intensive Care Unit Physiotherapy', title:'Chest and Limb Physiotherapy', alt:true,
      body:[
        'This has two aspects, chest and limb physiotherapy.',
        '<strong>Chest physiotherapy:</strong> This is done to mobilise and remove all secretions from the lungs and tracheal regions of post operative patients. Secretions are generally inflammatory responses of the body to intubation and surgical procedures.',
        '<strong>Limb physiotherapy:</strong> Early mobilization of the patient; prevent bed sores, Muscle atrophy and Deep Vein Thrombosis; and to maintain joint range of motion.'
      ] },
    { type:'prose', eyebrow:'Musculoskeletal Physiotherapy', title:'Modalities and Manual Techniques',
      body:[
        'Generally various therapeutic physical therapy modalities are available, including exercise prescription (strength, motor control, stretching and endurance), manual techniques (joint mobilization/manipulation), soft tissue massage, and various forms of so-called electrophysical agents (such as cryotherapy, heat therapy, iontophoresis and electrotherapy). Examination, history, and analysis of movement dysfunction decide which modality to use.'
      ] },
    { type:'prose', eyebrow:'Cardiopulmonary Physiotherapy', title:'From Premature Babies to Older Adults', alt:true,
      body:[
        'Cardiopulmonary physical therapists work with patients in a variety of settings. They treat acute problems like asthma and acute chest infections; they are involved in the preparation and recovery of patients from major surgery; they also treat a wide range of chronic cardiac and respiratory conditions like Chronic Obstructive Pulmonary Disease (COPD), cystic fibrosis (CF), post-myocardial infarction (MI) and post CABG. They work with all ages from premature babies to older adults at the end of their life. Physical therapists are pioneering new management techniques for non-organic respiratory problems like hyperventilation and other stress-related disorders as well as leading the development of cardio-pulmonary rehabilitation and non-invasive ventilation.',
        'Cardiopulmonary physical therapists use physical modalities to treat people. This may involve using manual techniques to clear infected mucus from a person’s chest, or using non-invasive ventilation to help a person breathe, or prescribing exercises to improve a patient’s functional exercise capacity.'
      ] },
    { type:'prose', eyebrow:'Neurological Physiotherapy', title:'Restoring Motor and Sensory Function',
      body:[
        'Treatment in neurological conditions is typically based upon exercises to restore motor and sensory functions through attempting to overcome motor deficits and improve motor patterns. This is generally patient specific since most of such physical therapy is at the bed side (ICU, Ward). Some of the conditions treated are, paraplegia, hemiplegia, post tumour decompression, discectomies, Atlanto Axial Dislocations, etc.'
      ] },
    { type:'prose', eyebrow:'Integumentary Physiotherapy', title:'Wounds, Burns and Scars', alt:true,
      body:[
        'Treatment of conditions involving the skin and related organs. Common conditions include wounds and burns. Treatment interventions include debridement of wounds and burns, dressings, scar prevention and reduction. In the SSSIHMS the physiotherapist releases contractures formed by surgical or burn scars.'
      ] },
    { type:'prose', eyebrow:'Thermal Therapies', title:'Moist Heat, Cryotherapy and Wax Bath',
      body:[
        '<strong>Moist Heat:</strong> These Hot packs usually consist of a silicate gel called Bentonite. The temperature of the ‘Hot Water Tank’ where the Hot Packs to be immersed is in the range between 75 to 80 degrees celsius. The heat energy obtained from the hot packs is used to relieve pain and induce relaxation.',
        '<em>Indications:</em> Muscular Pain, General Relaxation. <em>Contraindications:</em> Individuals with lack of heat sensation, local open wounds, burns, unhealed scars. <em>Advantages:</em> Relief of pain, muscular relaxation.',
        '<strong>Cryotherapy:</strong> This is a treatment involving the external application of Ice. This is the oldest and most common treatment. The temperature of the skin over the ailment is reduced to 10°C during the treatment.',
        '<em>Indications:</em> Pain, muscle spasm (muscles become tight and painful), spasticity (muscles become tight due to damage to the brain), after any surgery, to train the muscle which has lost its action, bed sores / pressure sores. <em>Contraindications:</em> Individuals with psychological fear of ice, cardiac problems, nerve injuries, lack of sensation. <em>Advantages:</em> In case of injury, bleeding is prevented; in case of bedsores, healing is faster. <em>Treatment Time:</em> about 1–3 minutes (it depends upon the patient’s condition). <em>Ways of Application:</em> ice towel, ice packs, immersion, ice cube massage, quick massage.',
        '<strong>Wax Bath:</strong> Paraffin wax is used for the treatment. The temperature of the wax is in the range between 40° to 44°c. The heat energy obtained from the hot wax is used to relieve pain and stiffness of the joints.',
        '<em>Indications:</em> Joint pain, joint stiffness, conditions like Osteoarthritis and Rheumatoid arthritis.'
      ] },
    { type:'prose', eyebrow:'Electro Therapy', title:'Interferential, Ultrasonic and Shortwave', alt:true,
      body:[
        '<strong>Interferential Therapy:</strong> Interferential Therapy (IFT) uses a Mid frequency current for treatment.',
        '<em>Indications:</em> Individuals with pain, muscle spasm (pain and tightness), swelling, muscle strain. <em>Contraindications:</em> If the treatment area has localised wounds, unhealed scar, recent cuts, skin infections.',
        '<strong>Ultrasonic Therapy:</strong> This involves usage of sound waves of a very high frequency, beyond the range of human hearing. The frequencies of waves employed for medical purposes are between 5,00,000 and 3,000,000 cycles/sec. Ultrasonic waves are generated by vibration of a Crystal mounted on a special head. The treatment time in the Initial Stage is 3 to 4 min and in severe stage is 6 to 8 min.',
        '<em>Indications:</em> Inflammation of Elbow Joint (Tennis elbow), Plantar fascitis (Heel pain), shortening of muscle or ligament, inflammation of tendons (for eg Supraspinatus tendnitis), ligament sprain (for eg Lateral Ligament sprain of ankle), unhealed scars. <em>Contraindications:</em> Avoidance to specialised structures such as eyes, ears, ovaries or testes, growing ends of bones, uterus of pregnant women, areas with poor blood supply (in case of Diabetes), cancer. <em>Advantages:</em> Relief of pain, healing of soft tissues (ligament), healing of unhealed scars. <em>Disadvantages:</em> Burns, cavitation (damage to bones), overdose.',
        '<strong>Shortwave Diathermy:</strong> Short Wave diathermy current is a high frequency alternating current. The heat energy obtained from the wave is used for giving relief to the patient. Its frequency is 27,120,000 cycles per second with a wavelength of 11 metres. There are two types of applications: the condenser field method (commonly used) and the cable method.',
        '<em>Indications:</em> Inflammation of shoulder joint / elbow joint (Tennis Elbow), degeneration of joints of neck (Cervical Spondylytis) / knee and hip (Osteoarthritis), ligament sprains in knee joint, low back ache, Plantar fascitis (Heel Pain), sinusitis. <em>Contraindications:</em> High fever; fluctuating blood pressure; very sensitive skin; persons with untreated fits; persons using cardiac pace maker; severe kidney and heart problems; pregnant women; mentally retarded individuals; tuberculosis of bone; malignant cancer.'
      ] },
    { type:'prose', eyebrow:'Exercise Therapy', title:'Manual Training in Physical Therapy',
      body:[
        'It is also called manual training in physical therapy and includes training for individuals who have difficulty in limb functionality. Parallel walking bars, Quadriceps table, Step trainer, Static cycle, Shoulder pulleys, Mariner’s wheel, Swiss Ball, Finger exercising are some of the techniques used in Exercise Therapy. Consider for example: A person affected by a stroke may have varying degrees of mobility ranging from partial movement to total incapacitation. Training such a person to walk involves goalsetting (training the person to use crutches/wheelchairs/artificial limbs), milestones, reevaluation of exercises, till maximum mobility is attained.',
        '<em>Indications:</em> Amputees (surgical removal of a limb), stroke, paralysis, balance training. Balance training is a training given to those who have difficulty in balance while rising from sitting to standing. Also indicated in Ataxia (balance disorder due to damage in a part of brain), loss of joint position sense, Parkinsonism (disorder in part of brain).',
        '<strong>Therapeutic Exercises:</strong> This is a kind of exercise, taught to improve the overall physical activity of the body to strengthen the muscles, bones, joints and ligament.',
        '<strong>Relaxed Passive Movements:</strong> It is a movement performed on the joints by the therapist, when the muscles or joints are affected. The purpose of the exercise is to obtain full range of the movement in the joint, for general relaxation, memorization of the movement pattern (bed ridden person), and for lymph drainage. <em>Indications:</em> Stroke (early stage), paralysis (early stage), bed ridden persons. <em>Contraindications:</em> Injuries in and around joints.',
        '<strong>Postural Drainage:</strong> Postural drainage is placing the patient in different positions, to drain out the secretions of the lungs by the assistance of gravity. <em>Indications:</em> Collection of chest secretion in case of lung disease, elderly persons, before and after the surgery (especially of heart and lungs).'
      ] },
    { type:'prose', eyebrow:'Therapeutic Massage', title:'One of the Oldest of the Health Sciences', alt:true,
      body:[
        'Massage is one of the oldest of the health sciences and has been used for curative purposes since time immemorial. Massage treatment uses touch to apply pressure to the body’s skin, muscles, tendons, ligaments. The idea of Massage is to ease disorders by relieving tension, promoting blood flow, calming nerves and loosening muscles. Modes of Therapeutic Massage include:',
        '1. <strong>Stroking</strong> — is performed with the whole hand or fingers. It comprises the usage of relaxed hand over the patient’s skin with a rhythm and pressure that produce a relaxing effect.',
        '2. <strong>Effleurage</strong> — is performed by spreading and moving the hands with pressure and speed, to gain relaxation and lymph drainage.',
        '3. <strong>Kneading</strong> — involves alternate compression and release of the part to be manipulated.',
        '4. <strong>Picking up</strong> — involves lifting up of tissue from underlying bone, releasing it after squeezing it.',
        '5. <strong>Wringing</strong> — technique lifts up the tissue and applies a twist to enhance stretching effect.',
        '6. <strong>Friction</strong> — is a small movement applied with thumb or finger where pressure is applied from superficial to depth of the tissue.',
        '7. <strong>Hacking</strong> — is performed with extended forearm and striking the skin using the side of the hand.',
        '8. <strong>Clapping</strong> — is done by striking the skin with cupped hands. Shaking and Vibration involves gentle strokes of shakes and vibrations respectively.',
        '<em>Advantages:</em> Relief of pain, muscle tightness is relieved, general relaxation, induce sleep in insomnia (sleepless nights), relieves tension, skin is toned, drainage of oedema or swelling, loosens secretion in the lungs. <em>Contraindications:</em> Large open wounds, burns, skin ulcers, gross oedema, extremely hairy areas, sensitive skin, bacterial infections, skin disease, malignancies like cancer.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Department and the Campus', items:[
      { src:IMG.equipment, caption:'Swami Blessing physiotherapy equipment' },
      { src:IMG.lamp, caption:'Sri Atal Behari Vajpayee, PM Lighting the Lamp' },
      { src:IMG.aerial, caption:'Ariel View of Hospital' },
      { src:IMG.dome, caption:'Dome Area' },
      { src:IMG.diwali, caption:'Diwali View' }
    ] }
  ]
};
})();
