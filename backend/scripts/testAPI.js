import fetch from 'node-fetch';

const testAPI = async () => {
  try {
    // First, get symptoms
    console.log('📡 Testing API endpoints...\n');
    
    console.log('1. Getting symptoms...');
    const symptomsRes = await fetch('http://localhost:10000/api/symptoms?limit=10');
    const symptoms = await symptomsRes.json();
    console.log(`✓ Got ${symptoms.length} symptoms`);
    console.log(`   Sample: ${symptoms.slice(0, 3).map(s => s.name).join(', ')}\n`);
    
    // Find COVID symptoms
    console.log('2. Searching for COVID symptoms...');
    const covidSymptomNames = ['Fever', 'Cough', 'Loss of smell', 'Loss of taste'];
    const covidSymptoms = symptoms.filter(s => covidSymptomNames.includes(s.name));
    console.log(`✓ Found ${covidSymptoms.length} COVID symptoms`);
    covidSymptoms.forEach(s => console.log(`   - ${s.name}`));
    
    if (covidSymptoms.length === 0) {
      console.log('\n❌ No COVID symptoms found. Need to check symptom names.');
      process.exit(1);
    }
    
    console.log('\n3. Testing prediction (without auth - will fail)...');
    const symptomIds = covidSymptoms.map(s => s._id);
    
    const predictRes = await fetch('http://localhost:10000/api/symptoms/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptomIds,
        age: 30,
        gender: 'male'
      })
    });
    
    console.log(`Response status: ${predictRes.status}`);
    const result = await predictRes.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAPI();
