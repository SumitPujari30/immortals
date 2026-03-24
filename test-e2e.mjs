const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('--- Registering User ---');
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';
  
  let res = await fetch(`${BASE_URL}/api/auth/signup/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  let data = await res.json();
  console.log('Register Res:', res.status, data);

  console.log('--- Logging In ---');
  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  console.log('Login Res Status:', res.status);
  try {
      data = await res.json();
      console.log('Login Res Body:', data);
  } catch(e) {
      console.log('Login Res Body: (not json)');
  }
  
  // Extract token if login is successful
  const cookies = res.headers.get('set-cookie');
  console.log('Cookies received:', cookies);

  console.log('--- Fetching Profile / Me ---');
  const headers = {};
  if (cookies) {
      headers['Cookie'] = cookies;
  }
  
  res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers
  });
  console.log('Me Res Status:', res.status);
  try {
      data = await res.json();
      console.log('Me Res Data:', data);
  } catch(e) {
      console.log('Me Res Body: (not json)');
  }

  console.log('--- Fetching Complaints Flow ---');
  res = await fetch(`${BASE_URL}/api/complaints`, {
      method: 'GET',
      headers
  });
  
  if (res.ok) {
      data = await res.json();
      console.log('Complaints list fetched. Count:', data.length || 0);
  } else {
      console.error('Failed to fetch complaints:', res.status, await res.text());
  }
}
run();
