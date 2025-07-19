const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const copyPasswordBtn = document.getElementById('copyPassword');
const copyTooltip = document.getElementById('copyTooltip');
//MADE BY KAIF TARASAGAR 
const generatePasswordBtn = document.getElementById('generatePassword');
const lengthInput = document.getElementById('length');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const strengthPercentageEl = document.getElementById('strength-percentage');
const crackTimeContainer = document.getElementById('crack-time-container');

const lengthCheckEl = document.getElementById('length-check');
const uppercaseCheckEl = document.getElementById('uppercase-check');
const lowercaseCheckEl = document.getElementById('lowercase-check');
const numberCheckEl = document.getElementById('number-check');
const specialCheckEl = document.getElementById('special-check');
//MADE BY KAIF TARASAGAR 
const weakPasswordCheckEl = document.getElementById('weak-password-check');
const pwnedCheckEl = document.getElementById('pwned-check');

const suggestionsEl = document.getElementById('suggestions');

const customWordInput = document.getElementById('customWord');
const mixPasswordBtn = document.getElementById('mixPassword');
const mixedPasswordOptionsEl = document.getElementById('mixedPasswordOptions');

const checkIconSVG = `<svg class="icon-check mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span></span>`;
const crossIconSVG = `<svg class="icon-cross mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span></span>`;

const updateCriteriaUI = (element, isMet, text) => {
    element.innerHTML = isMet ? checkIconSVG : crossIconSVG;
    element.querySelector('span').textContent = text;
    element.classList.toggle('text-gray-400', !isMet);
    element.classList.toggle('text-green-400', isMet);
    element.classList.toggle('text-red-400', element === pwnedCheckEl && isMet === false);
};
//MADE BY KAIF TARASAGAR 
const resetUI = () => {
    strengthText.textContent = 'Start typing...';
    strengthPercentageEl.textContent = '';
    strengthBar.style.width = '0%';
    strengthBar.className = 'h-3 rounded-full strength-bar-fill';
    crackTimeContainer.textContent = '';
    suggestionsEl.innerHTML = 'Start typing or generate a password to receive security recommendations.';
    mixedPasswordOptionsEl.innerHTML = '<li class="text-sm">Enter a custom word and click "Mix & Generate" to see options.</li>';
    updateCriteriaUI(lengthCheckEl, false, 'Minimum 12 characters');
    updateCriteriaUI(uppercaseCheckEl, false, 'Uppercase letters (A-Z)');
    updateCriteriaUI(lowercaseCheckEl, false, 'Lowercase letters (a-z)');
    updateCriteriaUI(numberCheckEl, false, 'Numbers (0-9)');
    updateCriteriaUI(specialCheckEl, false, 'Special characters (!@#$%)');
    updateCriteriaUI(weakPasswordCheckEl, false, 'Not a common password');
    updateCriteriaUI(pwnedCheckEl, false, 'Not found in breaches');
};

const checkPasswordComplexity = async () => {
    const password = passwordInput.value;

    if (password.length === 0) {
        resetUI();
        return;
    }

    const result = zxcvbn(password);
    const score = result.score;
    
    updateCriteriaUI(lengthCheckEl, password.length >= 12, 'Minimum 12 characters');
    updateCriteriaUI(uppercaseCheckEl, /[A-Z]/.test(password), 'Uppercase letters (A-Z)');
    updateCriteriaUI(lowercaseCheckEl, /[a-z]/.test(password), 'Lowercase letters (a-z)');
    updateCriteriaUI(numberCheckEl, /[0-9]/.test(password), 'Numbers (0-9)');
    updateCriteriaUI(specialCheckEl, /[!@#$%^&*(),.?":{}|<>]/.test(password), 'Special characters (!@#$%)');
    updateCriteriaUI(weakPasswordCheckEl, !result.feedback.warning, 'Not a common password');
//MADE BY KAIF TARASAGAR 
    const isPwned = await checkPwnedPassword(password);
    updateCriteriaUI(pwnedCheckEl, !isPwned, isPwned ? `Pwned! Found ${isPwned} times.` : 'Not found in breaches');

    const strengthPercentage = (score / 4) * 100;
    strengthBar.style.width = `${Math.max(5, strengthPercentage)}%`;
    
    const strengthLevels = {
        0: { text: 'Very Weak', color: 'bg-red-600' },
        1: { text: 'Weak', color: 'bg-orange-500' },
        2: { text: 'Fair', color: 'bg-yellow-400' },
        3: { text: 'Good', color: 'bg-cyan-500' },
        4: { text: 'Strong', color: 'bg-green-500' }
    };

    strengthText.textContent = strengthLevels[score].text;
    strengthPercentageEl.textContent = `(${Math.round(strengthPercentage)}/100)`;
    strengthBar.className = `h-3 rounded-full strength-bar-fill ${strengthLevels[score].color}`;

    crackTimeContainer.textContent = `Estimated time to crack: ${result.crack_times_display.offline_fast_hashing_1e10_per_second}`;
    
    let suggestionsHTML = '';
    if (isPwned) {
        suggestionsHTML += `<li class="flex items-start text-red-400"><svg class="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l4.5 8.625c.612 1.17-.24 2.626-1.503 2.626H5.254c-1.263 0-2.115-1.456-1.503-2.625l4.5-8.625zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>This password has been found in data breaches. Please choose a different one.</li>`;
    }
    if (result.feedback.warning) {
        suggestionsHTML += `<li class="flex items-start text-yellow-400"><svg class="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l4.5 8.625c.612 1.17-.24 2.626-1.503 2.626H5.254c-1.263 0-2.115-1.456-1.503-2.625l4.5-8.625zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>${result.feedback.warning}</li>`;
    }
    if (result.feedback.suggestions.length > 0) {
         suggestionsHTML += result.feedback.suggestions.map(s => `<li class="flex items-start"><svg class="w-4 h-4 mr-2 mt-1 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>${s}</li>`).join('');
    }
                    //MADE BY KAIF TARASAGAR 
    if (suggestionsHTML) {
        suggestionsEl.innerHTML = `<ul>${suggestionsHTML}</ul>`;
    } else {
        suggestionsEl.innerHTML = '<div class="text-green-400 font-semibold flex items-center"><svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Your password is strong!</div>';
    }
};

togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeOpen.classList.toggle('hidden', isPassword);
    eyeClosed.classList.toggle('hidden', !isPassword);
});

copyPasswordBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    if (!password) return;
                                   //MADE BY KAIF TARASAGAR 
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = password;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    try {
        document.execCommand('copy');
        copyTooltip.textContent = 'Copied!';
        setTimeout(() => { copyTooltip.textContent = 'Copy to clipboard'; }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
        copyTooltip.textContent = 'Failed to copy!';
    } finally {
        document.body.removeChild(tempTextArea);
    }
});

generatePasswordBtn.addEventListener('click', () => {
    const length = parseInt(lengthInput.value, 10);
    const charset = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
                             //MADE BY KAIF TARASAGAR 
    let password = '';
    let availableChars = charset.lower + charset.upper + charset.numbers + charset.special;
    
    password += charset.lower[Math.floor(Math.random() * charset.lower.length)];
    password += charset.upper[Math.floor(Math.random() * charset.upper.length)];
    password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    password += charset.special[Math.floor(Math.random() * charset.special.length)];
    
    for (let i = 4; i < length; i++) {
        password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    passwordInput.value = password;
    checkPasswordComplexity();
});

async function sha1(message) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hexHash.toUpperCase();
}

const checkPwnedPassword = async (password) => {
    if (!password) return 0;

    const hashedPassword = await sha1(password);
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5);

    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) {
            if (response.status === 429) {
                console.warn("HIBP API rate limit hit. Please wait a moment before checking again.");
                return 0;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        } //MADE BY KAIF TARASAGAR 
        const text = await response.text();
        const hashes = text.split('\n').map(line => {
            const [hashSuffix, count] = line.split(':');
            return { suffix: hashSuffix, count: parseInt(count, 10) };
        });

        const found = hashes.find(h => h.suffix === suffix);
        return found ? found.count : 0;
    } catch (error) {
        console.error("Error checking pwned password:", error);
        return 0;
    }
};

const generateRandomComponent = (len) => {
    const charset = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    let component = '';
    let availableChars = charset.lower + charset.upper + charset.numbers + charset.special;
    for (let i = 0; i < len; i++) {
        component += availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    return component;
};
                         //MADE BY KAIF TARASAGAR 
mixPasswordBtn.addEventListener('click', async () => {
    const customWord = customWordInput.value.trim();
    if (customWord.length === 0) {
        mixedPasswordOptionsEl.innerHTML = '<li class="text-red-400">Please enter a custom word to mix.</li>';
        return;
    }

    mixedPasswordOptionsEl.innerHTML = '';
    const minComponentLength = 4;
    const maxComponentLength = 8;
    const numOptions = 5;

    for (let i = 0; i < numOptions; i++) {
        const randomLength = Math.floor(Math.random() * (maxComponentLength - minComponentLength + 1)) + minComponentLength;
        const randomComponent = generateRandomComponent(randomLength);
                 
//MADE BY KAIF TARASAGAR 
                                  
        let mixedPassword;
        const strategy = Math.floor(Math.random() * 3);

        switch (strategy) {
            case 0:
                mixedPassword = customWord + randomComponent;
                break;
            case 1:
                mixedPassword = randomComponent + customWord;
                break;
            case 2:
                const parts = [customWord, randomComponent];
                mixedPassword = parts.sort(() => 0.5 - Math.random()).join('');
                break;
        }

        const li = document.createElement('li');
        li.className = 'bg-gray-800 p-3 rounded-md flex justify-between items-center';
        
        const passwordSpan = document.createElement('span');
        passwordSpan.textContent = mixedPassword;
        passwordSpan.className = 'font-mono text-cyan-300 break-all';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'ml-4 p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors duration-200 flex-shrink-0';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(mixedPassword);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 1500);
        };

        li.appendChild(passwordSpan);
        li.appendChild(copyBtn);
        mixedPasswordOptionsEl.appendChild(li);
    }
    
    if (numOptions > 0) {
        passwordInput.value = mixedPasswordOptionsEl.firstElementChild.querySelector('span').textContent;
        await checkPasswordComplexity();
    }
});

passwordInput.addEventListener('input', checkPasswordComplexity);

resetUI();
                                              /* MADE BY KAIF TARASAGAR 
                                               
                                              https://www.linkedin.com/in/kaif-tarasgar-0b5425326/
                                              
                                              https://x.com/Kaif_T_200*/
