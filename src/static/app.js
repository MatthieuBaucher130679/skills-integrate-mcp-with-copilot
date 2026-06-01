const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const currentUserSpan = document.getElementById('current-user');
const logoutBtn = document.getElementById('logout-btn');
const signupBtns = document.querySelectorAll('.signup-btn');
const registrations = JSON.parse(localStorage.getItem('registrations')) || [];

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        
        if (response.ok) {
            loginMessage.textContent = 'Login successful!';
            authSection.classList.add('hidden');
            mainSection.classList.remove('hidden');
            currentUserSpan.textContent = username;
            displayRegistrations();
        } else {
            loginMessage.textContent = 'Invalid credentials';
        }
    } catch (error) {
        loginMessage.textContent = 'Login failed: ' + error.message;
    }
});

logoutBtn.addEventListener('click', async () => {
    await fetch('/logout', {method: 'POST'});
    authSection.classList.remove('hidden');
    mainSection.classList.add('hidden');
    loginForm.reset();
    loginMessage.textContent = '';
});

signupBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const activity = e.target.dataset.activity;
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({activity})
            });
            
            if (response.ok) {
                registrations.push(activity);
                localStorage.setItem('registrations', JSON.stringify(registrations));
                displayRegistrations();
            }
        } catch (error) {
            console.error('Signup failed:', error);
        }
    });
});

function displayRegistrations() {
    const registrationsList = document.getElementById('registrations');
    registrationsList.innerHTML = '';
    registrations.forEach((activity, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${activity} <button class="unregister-btn" data-index="${index}">Unregister</button>`;
        registrationsList.appendChild(li);
    });
    
    document.querySelectorAll('.unregister-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = e.target.dataset.index;
            try {
                const response = await fetch('/unregister', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({activity: registrations[index]})
                });
                
                if (response.ok) {
                    registrations.splice(index, 1);
                    localStorage.setItem('registrations', JSON.stringify(registrations));
                    displayRegistrations();
                }
            } catch (error) {
                console.error('Unregister failed:', error);
            }
        });
    });
}

// Check if already logged in
fetch('/me').then(r => r.json()).then(data => {
    if (data.username) {
        currentUserSpan.textContent = data.username;
        authSection.classList.add('hidden');
        mainSection.classList.remove('hidden');
        displayRegistrations();
    }
});
