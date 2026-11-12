export type Course = {
  name: string;
  topic: string;
  description: string;
  lessons: string[];
};

export const courses: Course[] = [
 {name:"Dental Anatomy",topic:"Foundations",description:"Explore tooth structure, form, and function.",lessons:["Tooth structure and tissues","Tooth surfaces and terminology","Types of teeth and dentition","Tooth morphology","Functions of the oral cavity"]},
 {name:"Dental Radiology",topic:"Clinical skills",description:"Build a foundation in dental imaging and interpretation.",lessons:["Introduction to dental radiographs","Periapical and bitewing views","Radiographic anatomy","Common radiographic findings","Image quality and limitations"]},
 {name:"Oral Health Basics",topic:"Core knowledge",description:"Understand prevention, hygiene, and healthy habits.",lessons:["Oral hygiene fundamentals","Plaque and biofilm","Caries prevention","Diet and oral health","Patient education basics"]}
];

export const lessonReadings: Record<string, string> = {
 "Tooth structure and tissues":"A tooth has four principal tissues: enamel, dentin, cementum and pulp. Enamel covers the crown and is highly mineralized. Dentin forms most of the tooth, cementum covers the root, and the pulp contains connective tissue, nerves and blood vessels.",
 "Tooth surfaces and terminology":"Dental surfaces are named by their relationship to the face, tongue, adjacent teeth and chewing surface. Common terms include mesial, distal, buccal or facial, lingual or palatal, occlusal and incisal. Consistent terminology helps clinicians describe findings clearly.",
 "Types of teeth and dentition":"The permanent dentition typically includes incisors, canines, premolars and molars. Each group has a characteristic shape related to its function. Primary and permanent dentitions differ in tooth number, morphology and eruption sequence.",
 "Tooth morphology":"Tooth morphology describes the external form and anatomical features of teeth. Crown shape, cusps, ridges, grooves and roots vary between tooth types. Learning these features supports identification and communication during examination.",
 "Functions of the oral cavity":"The oral cavity contributes to mastication, speech, taste, swallowing and the initial stages of digestion. Teeth, tongue, salivary glands, mucosa and supporting structures work together to perform these functions.",
 "Introduction to dental radiographs":"Dental radiographs provide two-dimensional information about teeth and surrounding structures. Common intraoral views include periapical and bitewing images. Images complement, rather than replace, history and clinical examination.",
 "Periapical and bitewing views":"A periapical view is designed to show the tooth from crown to root apex and surrounding periapical tissues. Bitewing views commonly show the crowns of upper and lower posterior teeth and their interproximal areas. View selection depends on the clinical question.",
 "Radiographic anatomy":"Radiographic anatomy includes the normal appearance of teeth, periodontal ligament space, lamina dura, alveolar crest and surrounding bone. Familiarity with normal anatomy helps learners recognize variations and identify findings that require further assessment.",
 "Common radiographic findings":"Radiographs may show restorations, caries-related radiolucencies, changes around root apices and alterations in bone levels. A radiographic appearance is not a diagnosis by itself; interpretation requires clinical context and appropriate tests.",
 "Image quality and limitations":"Image quality is affected by positioning, exposure, movement, contrast and coverage. Dental radiographs are two-dimensional, so structures may overlap. Poor-quality images can obscure details and may need to be repeated only when clinically justified.",
 "Oral hygiene fundamentals":"Daily plaque control commonly includes effective toothbrushing and cleaning between teeth. Technique, consistency and suitable tools matter. Individual advice should account for a person's needs and should be discussed with a dental professional.",
 "Plaque and biofilm":"Dental plaque is a structured microbial biofilm that forms on tooth surfaces. If it is not regularly disrupted, it can contribute to caries and gingival inflammation. Mechanical cleaning is central to controlling plaque accumulation.",
 "Caries prevention":"Caries prevention involves reducing frequent free-sugar exposure, using fluoride appropriately, maintaining plaque control and attending risk-based dental reviews. Prevention plans should be tailored to individual risk and professional guidance.",
 "Diet and oral health":"The frequency of fermentable carbohydrate exposure can influence the balance between demineralization and remineralization. Water and balanced dietary patterns support general health. Dental dietary advice should be practical and individualized.",
 "Patient education basics":"Effective patient education uses clear language, checks understanding and agrees on realistic next steps. Open questions and teach-back can help identify misunderstandings. Advice should be respectful and adapted to the person's circumstances."
};
