document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. DOM Elements Selection
  const container = document.getElementById('container');

  // Desktop Slider Toggles
  const signUpToggleBtn = document.getElementById('signUpToggle');
  const signInToggleBtn = document.getElementById('signInToggle');

  // Mobile Tabs
  const mobileSignInTab = document.getElementById('mobileSignInTab');
  const mobileSignUpTab = document.getElementById('mobileSignUpTab');

  // Forms
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');

  // Sign In Form Inputs
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const rememberMe = document.getElementById('rememberMe');
  const loginFeedback = document.getElementById('loginFeedback');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const forgotPassLink = document.getElementById('forgotPassLink');

  // Sign Up Form Inputs
  const signupName = document.getElementById('signupName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPhone = document.getElementById('signupPhone');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirmPassword = document.getElementById('signupConfirmPassword');
  const signupTerms = document.getElementById('signupTerms');
  const signupFeedback = document.getElementById('signupFeedback');
  const signupSubmitBtn = document.getElementById('signupSubmitBtn');

  // Password Strength Meter Elements
  const strengthBarFill = document.getElementById('strengthBarFill');
  const strengthLabel = document.getElementById('strengthLabel');

  // 2. Panel Switchers (Desktop Slider & Mobile Tabs)
  function switchToSignUp() {
    container.classList.add('right-panel-active');
    container.classList.add('mobile-signup-active');

    if (mobileSignUpTab && mobileSignInTab) {
      mobileSignUpTab.classList.add('active');
      mobileSignInTab.classList.remove('active');
    }

    clearFeedback(loginFeedback);
  }

  function switchToSignIn() {
    container.classList.remove('right-panel-active');
    container.classList.remove('mobile-signup-active');

    if (mobileSignUpTab && mobileSignInTab) {
      mobileSignInTab.classList.add('active');
      mobileSignUpTab.classList.remove('active');
    }

    clearFeedback(signupFeedback);
  }

  if (signUpToggleBtn) signUpToggleBtn.addEventListener('click', switchToSignUp);
  if (signInToggleBtn) signInToggleBtn.addEventListener('click', switchToSignIn);

  if (mobileSignUpTab) mobileSignUpTab.addEventListener('click', switchToSignUp);
  if (mobileSignInTab) mobileSignInTab.addEventListener('click', switchToSignIn);

  // 3. Password Visibility Toggles (Reusable)
  const toggleButtons = document.querySelectorAll('.toggle-password');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      const icon = btn.querySelector('i');

      if (!targetInput) return;

      const isPassword = targetInput.getAttribute('type') === 'password';
      targetInput.setAttribute('type', isPassword ? 'text' : 'password');

      if (isPassword) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });

  // 4. Password Strength Meter Logic
  function calculatePasswordStrength(password) {
    let score = 0;
    if (!password) return 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;

    if (/\d/.test(password)) score += 1;

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    return Math.min(score, 4);
  }

  if (signupPassword) {
    signupPassword.addEventListener('input', () => {
      const val = signupPassword.value;
      const score = calculatePasswordStrength(val);

      strengthBarFill.className = 'strength-bar-fill';
      strengthLabel.className = 'strength-text';

      if (!val) {
        strengthLabel.textContent = 'Enter password';
        return;
      }

      switch (score) {
        case 1:
          strengthBarFill.classList.add('weak');
          strengthLabel.classList.add('weak');
          strengthLabel.textContent = 'Weak (add numbers & symbols)';
          break;
        case 2:
          strengthBarFill.classList.add('fair');
          strengthLabel.classList.add('fair');
          strengthLabel.textContent = 'Fair (medium complexity)';
          break;
        case 3:
          strengthBarFill.classList.add('good');
          strengthLabel.classList.add('good');
          strengthLabel.textContent = 'Good (strong protection)';
          break;
        case 4:
          strengthBarFill.classList.add('strong');
          strengthLabel.classList.add('strong');
          strengthLabel.textContent = 'Strong (excellent!)';
          break;
        default:
          strengthBarFill.classList.add('weak');
          strengthLabel.classList.add('weak');
          strengthLabel.textContent = 'Too Short (min 8 chars)';
          break;
      }

      if (signupConfirmPassword.value.trim().length > 0) {
        validateConfirmPassword();
      }
    });
  }

  // 5. Validation Utilities & Regex Patterns
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

  function showError(inputElement, errorElementId, message) {
    const parentGroup = inputElement.closest('.input-group') || inputElement.closest('.checkbox-row');
    const errorEl = document.getElementById(errorElementId);

    if (parentGroup) {
      parentGroup.classList.add('has-error');
      parentGroup.classList.remove('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearError(inputElement, errorElementId) {
    const parentGroup = inputElement.closest('.input-group') || inputElement.closest('.checkbox-row');
    const errorEl = document.getElementById(errorElementId);

    if (parentGroup) {
      parentGroup.classList.remove('has-error');
      parentGroup.classList.add('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function showFeedback(feedbackContainer, type, message) {
    feedbackContainer.className = `feedback-alert show ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    feedbackContainer.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  }

  function clearFeedback(feedbackContainer) {
    if (feedbackContainer) {
      feedbackContainer.className = 'feedback-alert';
      feedbackContainer.innerHTML = '';
    }
  }

  // 6. Sign In Form Validation
  function validateLoginEmail() {
    const val = loginEmail.value.trim();
    if (!val) {
      showError(loginEmail, 'loginEmailError', 'Email address is required');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      showError(loginEmail, 'loginEmailError', 'Please enter a valid email address');
      return false;
    }
    clearError(loginEmail, 'loginEmailError');
    return true;
  }

  function validateLoginPassword() {
    const val = loginPassword.value;
    if (!val) {
      showError(loginPassword, 'loginPasswordError', 'Password is required');
      return false;
    }
    clearError(loginPassword, 'loginPasswordError');
    return true;
  }

  loginEmail.addEventListener('input', () => clearError(loginEmail, 'loginEmailError'));
  loginPassword.addEventListener('input', () => clearError(loginPassword, 'loginPasswordError'));

  const savedEmail = localStorage.getItem('metaSkillRememberedEmail');
  if (savedEmail) {
    loginEmail.value = savedEmail;
    rememberMe.checked = true;
  }

  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFeedback(loginFeedback);

    const isEmailValid = validateLoginEmail();
    const isPasswordValid = validateLoginPassword();

    if (!isEmailValid || !isPasswordValid) return;

    if (rememberMe.checked) {
      localStorage.setItem('metaSkillRememberedEmail', loginEmail.value.trim());
    } else {
      localStorage.removeItem('metaSkillRememberedEmail');
    }

    loginSubmitBtn.classList.add('is-loading');

    setTimeout(() => {
      loginSubmitBtn.classList.remove('is-loading');
      showFeedback(loginFeedback, 'success', 'Welcome back! Authentication successful.');

      loginPassword.value = '';
      const passGroup = loginPassword.closest('.input-group');
      if (passGroup) passGroup.classList.remove('is-valid');
    }, 1200);
  });

  // 7. Sign Up Form Validation
  function validateSignupName() {
    const val = signupName.value.trim();
    if (!val) {
      showError(signupName, 'signupNameError', 'Full name is required');
      return false;
    }
    if (val.length < 3) {
      showError(signupName, 'signupNameError', 'Name must be at least 3 characters');
      return false;
    }
    clearError(signupName, 'signupNameError');
    return true;
  }

  function validateSignupEmail() {
    const val = signupEmail.value.trim();
    if (!val) {
      showError(signupEmail, 'signupEmailError', 'Email address is required');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      showError(signupEmail, 'signupEmailError', 'Please enter a valid email address');
      return false;
    }
    clearError(signupEmail, 'signupEmailError');
    return true;
  }

  function validateSignupPhone() {
    const val = signupPhone.value.trim();
    if (!val) {
      showError(signupPhone, 'signupPhoneError', 'Phone number is required');
      return false;
    }
    if (!PHONE_REGEX.test(val) || val.replace(/\D/g, '').length < 10) {
      showError(signupPhone, 'signupPhoneError', 'Enter a valid phone number (min 10 digits)');
      return false;
    }
    clearError(signupPhone, 'signupPhoneError');
    return true;
  }

  function validateSignupPassword() {
    const val = signupPassword.value;
    if (!val) {
      showError(signupPassword, 'signupPasswordError', 'Password is required');
      return false;
    }
    if (val.length < 8) {
      showError(signupPassword, 'signupPasswordError', 'Password must be at least 8 characters');
      return false;
    }
    clearError(signupPassword, 'signupPasswordError');
    return true;
  }

  function validateConfirmPassword() {
    const passVal = signupPassword.value;
    const confirmVal = signupConfirmPassword.value;

    if (!confirmVal) {
      showError(signupConfirmPassword, 'signupConfirmPasswordError', 'Please confirm your password');
      return false;
    }
    if (passVal !== confirmVal) {
      showError(signupConfirmPassword, 'signupConfirmPasswordError', 'Passwords do not match');
      return false;
    }
    clearError(signupConfirmPassword, 'signupConfirmPasswordError');
    return true;
  }

  function validateTerms() {
    if (!signupTerms.checked) {
      showError(signupTerms, 'signupTermsError', 'You must agree to the Terms & Privacy Policy');
      return false;
    }
    clearError(signupTerms, 'signupTermsError');
    return true;
  }

  signupName.addEventListener('input', () => clearError(signupName, 'signupNameError'));
  signupEmail.addEventListener('input', () => clearError(signupEmail, 'signupEmailError'));
  signupPhone.addEventListener('input', () => clearError(signupPhone, 'signupPhoneError'));
  signupPassword.addEventListener('input', () => clearError(signupPassword, 'signupPasswordError'));
  signupConfirmPassword.addEventListener('input', validateConfirmPassword);
  signupTerms.addEventListener('change', () => clearError(signupTerms, 'signupTermsError'));

  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFeedback(signupFeedback);

    const isNameValid = validateSignupName();
    const isEmailValid = validateSignupEmail();
    const isPhoneValid = validateSignupPhone();
    const isPasswordValid = validateSignupPassword();
    const isConfirmValid = validateConfirmPassword();
    const isTermsValid = validateTerms();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmValid && isTermsValid;

    if (!isFormValid) return;

    signupSubmitBtn.classList.add('is-loading');

    setTimeout(() => {
      signupSubmitBtn.classList.remove('is-loading');
      showFeedback(signupFeedback, 'success', 'Account created! Redirecting to Sign In...');

      signUpForm.reset();
      strengthBarFill.className = 'strength-bar-fill';
      strengthLabel.textContent = 'Enter password';
      strengthLabel.className = 'strength-text';

      document.querySelectorAll('#signUpForm .input-group, #signUpForm .checkbox-row').forEach(group => {
        group.classList.remove('is-valid');
      });

      setTimeout(() => {
        switchToSignIn();
      }, 1400);

    }, 1400);
  });

  // 8. Social Buttons & Forgot Password Handlers
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('title') || 'Social Provider';
      alert(`MetaSkillGroup Demo: OAuth sign-in with ${provider} initiated.`);
    });
  });

  if (forgotPassLink) {
    forgotPassLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = loginEmail.value.trim() || prompt('Please enter your registered email address for password recovery:');
      if (email && EMAIL_REGEX.test(email)) {
        showFeedback(loginFeedback, 'success', `Password reset link sent to ${email}`);
      } else if (email) {
        showFeedback(loginFeedback, 'error', 'Please enter a valid email address.');
      }
    });
  }

});
