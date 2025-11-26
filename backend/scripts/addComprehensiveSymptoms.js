import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Symptom from '../models/Symptom.js';

dotenv.config();

// Additional symptoms to add to the database
const newSymptoms = [
  // Additional symptoms for comprehensive disease coverage
  { name: 'Loss of smell', category: 'respiratory', severity: 'mild', description: 'Inability to smell', commonNames: ['anosmia'] },
  { name: 'Loss of taste', category: 'respiratory', severity: 'mild', description: 'Inability to taste', commonNames: ['ageusia'] },
  { name: 'Severe headache', category: 'neurological', severity: 'severe', description: 'Intense debilitating head pain', commonNames: ['migraine'] },
  { name: 'Stiff neck', category: 'neurological', severity: 'moderate', description: 'Difficulty moving neck', commonNames: ['neck stiffness'] },
  { name: 'Persistent cough', category: 'respiratory', severity: 'moderate', description: 'Long-lasting cough', commonNames: ['chronic cough'] },
  { name: 'Coughing up mucus', category: 'respiratory', severity: 'moderate', description: 'Producing phlegm', commonNames: ['productive cough'] },
  { name: 'Chest tightness', category: 'respiratory', severity: 'moderate', description: 'Pressure in chest', commonNames: ['tight chest'] },
  { name: 'Swollen lymph nodes', category: 'general', severity: 'moderate', description: 'Enlarged lymph glands', commonNames: ['swollen glands'] },
  { name: 'Increased thirst', category: 'general', severity: 'mild', description: 'Excessive thirst', commonNames: ['polydipsia'] },
  { name: 'Extreme hunger', category: 'general', severity: 'mild', description: 'Excessive appetite', commonNames: ['polyphagia'] },
  { name: 'Slow-healing sores', category: 'dermatological', severity: 'moderate', description: 'Wounds that heal slowly', commonNames: ['delayed healing'] },
  { name: 'Feeling cold', category: 'general', severity: 'mild', description: 'Sensitivity to cold', commonNames: ['cold intolerance'] },
  { name: 'Rapid weight loss', category: 'general', severity: 'severe', description: 'Sudden significant weight loss', commonNames: ['unexplained weight loss'] },
  { name: 'Darkening of skin', category: 'dermatological', severity: 'mild', description: 'Skin becoming darker', commonNames: ['hyperpigmentation'] },
  { name: 'Purple stretch marks', category: 'dermatological', severity: 'mild', description: 'Purple-colored stretch marks', commonNames: ['striae'] },
  { name: 'Moon face', category: 'dermatological', severity: 'mild', description: 'Round full face', commonNames: ['facial swelling'] },
  { name: 'Sun sensitivity', category: 'dermatological', severity: 'mild', description: 'Sensitivity to sunlight', commonNames: ['photosensitivity'] },
  { name: 'Butterfly-shaped rash', category: 'dermatological', severity: 'moderate', description: 'Rash across cheeks and nose', commonNames: ['malar rash'] },
  { name: 'Red scaly patches', category: 'dermatological', severity: 'mild', description: 'Red scaly areas on skin', commonNames: ['psoriatic patches'] },
  { name: 'Painful swollen joints', category: 'musculoskeletal', severity: 'moderate', description: 'Swollen joints with pain', commonNames: ['joint inflammation'] },
  { name: 'Morning stiffness', category: 'musculoskeletal', severity: 'moderate', description: 'Stiffness especially in morning', commonNames: ['morning joint stiffness'] },
  { name: 'Grating sensation', category: 'musculoskeletal', severity: 'moderate', description: 'Grinding feeling in joints', commonNames: ['crepitus'] },
  { name: 'Loss of flexibility', category: 'musculoskeletal', severity: 'moderate', description: 'Reduced joint flexibility', commonNames: ['stiffness'] },
  { name: 'Widespread pain', category: 'musculoskeletal', severity: 'moderate', description: 'Pain throughout body', commonNames: ['chronic pain'] },
  { name: 'Heel pain', category: 'musculoskeletal', severity: 'mild', description: 'Pain in heel area', commonNames: ['plantar pain'] },
  { name: 'Uneven shoulders', category: 'musculoskeletal', severity: 'mild', description: 'Shoulders at different heights', commonNames: ['shoulder asymmetry'] },
  { name: 'Visible curve in spine', category: 'musculoskeletal', severity: 'moderate', description: 'Spinal curvature', commonNames: ['scoliosis'] },
  { name: 'Stooped posture', category: 'musculoskeletal', severity: 'moderate', description: 'Forward-bent posture', commonNames: ['kyphosis'] },
  { name: 'Loss of height', category: 'musculoskeletal', severity: 'mild', description: 'Decrease in height', commonNames: ['height loss'] },
  { name: 'Itchy rash', category: 'dermatological', severity: 'mild', description: 'Rash with itching', commonNames: ['pruritic rash'] },
  { name: 'Fluid-filled blisters', category: 'dermatological', severity: 'moderate', description: 'Blisters containing fluid', commonNames: ['vesicles'] },
  { name: 'Loss of skin color', category: 'dermatological', severity: 'mild', description: 'Patches of depigmented skin', commonNames: ['vitiligo'] },
  { name: 'Facial redness', category: 'dermatological', severity: 'mild', description: 'Redness on face', commonNames: ['facial flushing'] },
  { name: 'Visible blood vessels', category: 'dermatological', severity: 'mild', description: 'Blood vessels visible on skin', commonNames: ['telangiectasia'] },
  { name: 'Swollen bumps', category: 'dermatological', severity: 'mild', description: 'Raised bumps on skin', commonNames: ['papules'] },
  { name: 'Ring-shaped rash', category: 'dermatological', severity: 'mild', description: 'Circular rash pattern', commonNames: ['ringworm'] },
  { name: 'Scaly rash between toes', category: 'dermatological', severity: 'mild', description: 'Itchy rash between toes', commonNames: ['athlete\'s foot'] },
  { name: 'Itchy welts', category: 'dermatological', severity: 'moderate', description: 'Raised itchy welts', commonNames: ['hives'] },
  { name: 'Blackheads', category: 'dermatological', severity: 'mild', description: 'Clogged pores', commonNames: ['comedones'] },
  { name: 'Whiteheads', category: 'dermatological', severity: 'mild', description: 'White bumps on skin', commonNames: ['closed comedones'] },
  { name: 'Cysts', category: 'dermatological', severity: 'moderate', description: 'Deep painful lumps', commonNames: ['skin cysts'] },
  { name: 'Nodules', category: 'dermatological', severity: 'moderate', description: 'Hard lumps under skin', commonNames: ['skin nodules'] },
  { name: 'Inflamed skin', category: 'dermatological', severity: 'moderate', description: 'Red swollen skin', commonNames: ['skin inflammation'] },
  { name: 'Crusty skin', category: 'dermatological', severity: 'mild', description: 'Crusty patches on skin', commonNames: ['crusting'] },
  { name: 'Painful rash', category: 'dermatological', severity: 'moderate', description: 'Rash with pain', commonNames: ['painful skin lesions'] },
  { name: 'Bull\'s-eye rash', category: 'dermatological', severity: 'moderate', description: 'Circular rash with clear center', commonNames: ['erythema migrans'] },
  { name: 'Fleshy bumps', category: 'dermatological', severity: 'mild', description: 'Small flesh-colored bumps', commonNames: ['warts'] },
  { name: 'Grainy bumps', category: 'dermatological', severity: 'mild', description: 'Small grainy bumps', commonNames: ['warts'] },
  { name: 'Excessive worry', category: 'psychological', severity: 'moderate', description: 'Persistent worrying', commonNames: ['constant worry'] },
  { name: 'Sadness', category: 'psychological', severity: 'moderate', description: 'Persistent feeling of sadness', commonNames: ['unhappiness'] },
  { name: 'Loss of interest', category: 'psychological', severity: 'moderate', description: 'No interest in activities', commonNames: ['anhedonia'] },
  { name: 'Sleep problems', category: 'psychological', severity: 'mild', description: 'Difficulty sleeping', commonNames: ['sleep disturbance'] },
  { name: 'Daytime sleepiness', category: 'psychological', severity: 'mild', description: 'Excessive sleepiness during day', commonNames: ['drowsiness'] },
  { name: 'Waking up gasping', category: 'psychological', severity: 'severe', description: 'Waking up gasping for air', commonNames: ['sleep apnea'] },
  { name: 'Cognitive difficulties', category: 'psychological', severity: 'moderate', description: 'Problems with thinking', commonNames: ['brain fog'] },
  { name: 'Burning urination', category: 'urinary', severity: 'moderate', description: 'Burning sensation when urinating', commonNames: ['dysuria'] },
  { name: 'Cloudy urine', category: 'urinary', severity: 'mild', description: 'Urine appears cloudy', commonNames: ['turbid urine'] },
  { name: 'Strong-smelling urine', category: 'urinary', severity: 'mild', description: 'Urine with strong odor', commonNames: ['foul-smelling urine'] },
  { name: 'Irregular periods', category: 'reproductive', severity: 'mild', description: 'Menstrual cycle irregularities', commonNames: ['irregular menstruation'] },
  { name: 'Heavy periods', category: 'reproductive', severity: 'moderate', description: 'Excessive menstrual bleeding', commonNames: ['menorrhagia'] },
  { name: 'Severe menstrual cramps', category: 'reproductive', severity: 'moderate', description: 'Severe period pain', commonNames: ['dysmenorrhea'] },
  { name: 'Pelvic pain', category: 'reproductive', severity: 'moderate', description: 'Pain in pelvic region', commonNames: ['lower abdominal pain'] },
  { name: 'Pain during intercourse', category: 'reproductive', severity: 'moderate', description: 'Pain during sexual intercourse', commonNames: ['dyspareunia'] },
  { name: 'Excess body hair', category: 'reproductive', severity: 'mild', description: 'Abnormal hair growth', commonNames: ['hirsutism'] },
  { name: 'Infertility', category: 'reproductive', severity: 'moderate', description: 'Difficulty conceiving', commonNames: ['inability to conceive'] },
  { name: 'Red spots on roof of mouth', category: 'respiratory', severity: 'mild', description: 'Red spots in mouth', commonNames: ['petechiae'] },
  { name: 'Swollen salivary glands', category: 'general', severity: 'moderate', description: 'Swollen glands near jaw', commonNames: ['parotid swelling'] },
  { name: 'Fear of water', category: 'psychological', severity: 'severe', description: 'Hydrophobia', commonNames: ['hydrophobia'] },
  { name: 'Lockjaw', category: 'musculoskeletal', severity: 'severe', description: 'Jaw muscle stiffness', commonNames: ['trismus'] },
  { name: 'Small blisters on hands', category: 'dermatological', severity: 'mild', description: 'Blisters on hands', commonNames: ['hand lesions'] },
  { name: 'Small blisters on feet', category: 'dermatological', severity: 'mild', description: 'Blisters on feet', commonNames: ['foot lesions'] },
  { name: 'Mouth sores', category: 'dermatological', severity: 'mild', description: 'Sores in mouth', commonNames: ['oral ulcers'] },
  { name: 'Snoring', category: 'respiratory', severity: 'mild', description: 'Loud breathing during sleep', commonNames: ['loud snoring'] },
  { name: 'Stopping breathing during sleep', category: 'respiratory', severity: 'severe', description: 'Breathing pauses during sleep', commonNames: ['apnea'] },
  { name: 'Goiter', category: 'general', severity: 'moderate', description: 'Enlarged thyroid gland', commonNames: ['thyroid swelling'] },
  { name: 'Bulging eyes', category: 'neurological', severity: 'moderate', description: 'Eyes protruding from sockets', commonNames: ['exophthalmos'] },
  { name: 'Dry eyes', category: 'dermatological', severity: 'mild', description: 'Lack of moisture in eyes', commonNames: ['eye dryness'] },
  { name: 'Itchy eyes', category: 'dermatological', severity: 'mild', description: 'Itching in eyes', commonNames: ['eye irritation'] },
  { name: 'Severe diarrhea', category: 'digestive', severity: 'severe', description: 'Profuse watery diarrhea', commonNames: ['watery diarrhea'] },
  { name: 'Bloody diarrhea', category: 'digestive', severity: 'severe', description: 'Diarrhea with blood', commonNames: ['blood in stool'] },
  { name: 'Stomach cramps', category: 'digestive', severity: 'moderate', description: 'Cramping pain in stomach', commonNames: ['abdominal cramping'] },
  { name: 'Acid reflux', category: 'digestive', severity: 'mild', description: 'Stomach acid flowing back', commonNames: ['regurgitation'] },
  { name: 'Abdominal swelling', category: 'digestive', severity: 'moderate', description: 'Swelling of abdomen', commonNames: ['ascites'] },
  { name: 'Easy bruising', category: 'digestive', severity: 'moderate', description: 'Bruising easily', commonNames: ['bruising'] },
  { name: 'Crushing chest pain', category: 'cardiovascular', severity: 'severe', description: 'Severe crushing sensation in chest', commonNames: ['heart attack pain'] },
  { name: 'Pain radiating to arm', category: 'cardiovascular', severity: 'severe', description: 'Pain spreading to arm', commonNames: ['referred pain'] },
  { name: 'Pain radiating to jaw', category: 'cardiovascular', severity: 'severe', description: 'Pain spreading to jaw', commonNames: ['jaw pain'] },
  { name: 'Swelling in ankles', category: 'cardiovascular', severity: 'moderate', description: 'Fluid retention in ankles', commonNames: ['ankle edema'] },
  { name: 'Swelling in feet', category: 'cardiovascular', severity: 'moderate', description: 'Fluid retention in feet', commonNames: ['foot edema'] },
  { name: 'Leg pain when walking', category: 'cardiovascular', severity: 'moderate', description: 'Pain in legs during activity', commonNames: ['claudication'] },
  { name: 'Leg numbness', category: 'cardiovascular', severity: 'moderate', description: 'Loss of feeling in legs', commonNames: ['leg numbness'] },
  { name: 'Blue lips', category: 'cardiovascular', severity: 'severe', description: 'Bluish discoloration of lips', commonNames: ['cyanosis'] },
  { name: 'Cold sweat', category: 'cardiovascular', severity: 'severe', description: 'Cold clammy perspiration', commonNames: ['diaphoresis'] },
  { name: 'Slow movement', category: 'neurological', severity: 'moderate', description: 'Reduced speed of movement', commonNames: ['bradykinesia'] },
  { name: 'Progressive memory loss', category: 'neurological', severity: 'severe', description: 'Worsening memory problems', commonNames: ['dementia'] },
  { name: 'Personality changes', category: 'neurological', severity: 'moderate', description: 'Changes in personality', commonNames: ['behavioral changes'] },
  { name: 'Difficulty speaking', category: 'neurological', severity: 'severe', description: 'Trouble forming words', commonNames: ['slurred speech'] },
  { name: 'Drooping face', category: 'neurological', severity: 'severe', description: 'One side of face drooping', commonNames: ['facial droop'] },
  { name: 'Arm weakness', category: 'neurological', severity: 'severe', description: 'Weakness in arms', commonNames: ['limb weakness'] },
  { name: 'Tunnel vision', category: 'neurological', severity: 'moderate', description: 'Loss of peripheral vision', commonNames: ['peripheral vision loss'] },
  { name: 'Cloudy vision', category: 'neurological', severity: 'moderate', description: 'Hazy or cloudy sight', commonNames: ['dim vision'] },
  { name: 'Fading colors', category: 'neurological', severity: 'mild', description: 'Colors appear less vibrant', commonNames: ['color vision loss'] },
  { name: 'Difficulty seeing at night', category: 'neurological', severity: 'moderate', description: 'Poor night vision', commonNames: ['night blindness'] },
  { name: 'Reduced central vision', category: 'neurological', severity: 'moderate', description: 'Loss of central vision', commonNames: ['macular degeneration'] },
  { name: 'Puffy cheeks', category: 'general', severity: 'mild', description: 'Swollen cheeks', commonNames: ['cheek swelling'] },
  { name: 'Dry mouth', category: 'general', severity: 'mild', description: 'Lack of saliva', commonNames: ['xerostomia'] },
  { name: 'Swollen jaw', category: 'general', severity: 'moderate', description: 'Swelling in jaw area', commonNames: ['jaw swelling'] },
  { name: 'High fever', category: 'general', severity: 'severe', description: 'Very high body temperature', commonNames: ['severe fever'] },
  { name: 'Extreme fatigue', category: 'general', severity: 'severe', description: 'Severe exhaustion', commonNames: ['profound fatigue'] },
  { name: 'Severe weakness', category: 'general', severity: 'severe', description: 'Profound weakness', commonNames: ['extreme weakness'] },
  { name: 'Muscle twitching', category: 'neurological', severity: 'mild', description: 'Involuntary muscle movements', commonNames: ['fasciculations'] },
  { name: 'Leg weakness', category: 'neurological', severity: 'moderate', description: 'Weakness in legs', commonNames: ['lower limb weakness'] },
  { name: 'Loss of balance', category: 'neurological', severity: 'moderate', description: 'Difficulty maintaining balance', commonNames: ['imbalance'] },
  { name: 'Painful muscle spasms', category: 'musculoskeletal', severity: 'severe', description: 'Severe muscle contractions', commonNames: ['severe spasms'] },
  { name: 'Swollen tonsils', category: 'respiratory', severity: 'moderate', description: 'Enlarged tonsils', commonNames: ['tonsillitis'] },
  { name: 'Red throat', category: 'respiratory', severity: 'mild', description: 'Redness in throat', commonNames: ['throat inflammation'] },
  { name: 'Severe sore throat', category: 'respiratory', severity: 'moderate', description: 'Intense throat pain', commonNames: ['severe throat pain'] },
];

const addSymptoms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB');

    let added = 0;
    let skipped = 0;

    for (const symptom of newSymptoms) {
      const existing = await Symptom.findOne({ name: symptom.name });
      if (!existing) {
        await Symptom.create(symptom);
        added++;
        console.log(`✓ Added: ${symptom.name}`);
      } else {
        skipped++;
        console.log(`- Skipped (exists): ${symptom.name}`);
      }
    }

    console.log(`\n✅ Complete! Added ${added} new symptoms, skipped ${skipped} existing symptoms.`);
    console.log(`Total symptoms in database: ${await Symptom.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding symptoms:', error);
    process.exit(1);
  }
};

addSymptoms();
