/**
* @file UserProfile.jsx
* @author Donnette Ansah
* @since 2025-11-13
* @purpose Provides a user profile page where users can view and update their account details.
*/
import { useState } from 'react';

import { apiFetch } from '../api/api.js';
import { useAuth } from '../components/auth/AuthContext.js';

import PageSection from '../components/PageSection.jsx';
import profileIcon from '../assets/Icon.png';
import logo from '/Family_Feud_Logo.png';

const COUNTRY_LIST = [
    "Australia",
    "Brazil",
    "Canada",
    "Dominican Republic",
    "France",
    "Ghana",
    "Italy",
    "Jamaica",
    "Japan",
    "Mexico",
    "Russia",
    "Spain",
    "United Kingdom",
    "United States",
    "United Arab Emirates"
];

export default function UserProfile() {
    const { user, setUser } = useAuth();

    const [form, setForm] = useState({
        username: user?.username || '',
        password: '',
        image: user?.image || null,
        country: user.country || "",
    });

    const [status, setStatus] = useState({
        state: 'idle', 
        message: '',
    });

    function handleChange(e) {
        const { name, value, files } = e.target;
        
        if (files) setForm((prev) => ({ ...prev, image: files[0] }));
        else setForm((prev) => ({ ...prev, [name]: value }) );
    }

async function handleSubmit(e) {
e.preventDefault();

setStatus({ state: 'loading', message: '' });

const formData = new FormData();
formData.append('username', form.username);

if (form.password) {
    formData.append('password', form.password);
}

if (form.image) {
    formData.append('image', form.image);
}

if (form.country) {
    formData.append('country', form.country);
}

const response = await apiFetch(`/user/${user._id}`, {
    method: 'PUT',
    body: formData,
});

if (response.ok) {
    const updatedUser = await response.json();
    setUser(updatedUser);
    setStatus({ state: 'success', message: 'Profile updated.' });
} else {
    setStatus({
        state: 'error',
        message: 'Profile update unsuccessful. Please try again.',
     });
   }
}

    const handleImageSearch = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setForm((prev) => ({ ...prev, image: url }));

        const img = document.getElementById('profile-avatar-img');
        if (img) img.src = url;

        handleChange(e);
    };

async function handleDeleteAccount() {
if (!window.confirm("Deleting your account is permanent. Are you sure you would like to proceed? ")) {
    return;
  }

  setStatus({ state: 'loading', message: '' });
  try {
    const response = await apiFetch(`/user/${user._id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setStatus({
         state: 'success', 
         message: 'Your account has been deleted.' });

         setUser(null);

         setTimeout(() => {
            window.location.href = '/login';
         }, 1000);
    } else {
      setStatus({
        state: 'error',
        message: 'We ran into an issue trying to delete your account. Please try again.',
      });
    }
  } catch (err) {
    setStatus({
      state: 'error',
      message: 'Something went wrong while deleting your account. Please try again.',
    });
  }
}

    const isSubmitting = status.state === 'loading';

    return (
        <div className="game_theme">

            <div className='page page--auth'>
                <header className='page__header'>
                    <p className='eyebrow'>Host Account</p>
                    <h2>My Profile</h2>
                    <p>View and update your account details.</p>
                    <img src={logo} alt="Family Feud Logo" className='page__logo' />
                </header>

                <PageSection
                    title='Profile Information'
                    description='Update your account details below.'
                >                
                        <div className='profile-avatar'>
                            <img
                                src={typeof user.image === 'string' ? user.image : profileIcon}
                                id="profile-avatar-img"
                                alt='Profile Avatar'
                                className='avatar-img'
                            />
                            <input 
                                id='profile-image-input'
                                type='file'
                                name='image'
                                accept="image/*"
                                onChange={handleImageSearch}
                            />
                            <label className='profile-avatar-button' htmlFor="profile-image-input">
                                Choose Image
                            </label>                   


                        <form className='form-stack form-stack--no-card' onSubmit={handleSubmit}>
                            <label>
                                Username
                                <input
                                    type='text'
                                    name='username'
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder='Enter your username'
                                    required
                                    disabled={isSubmitting}
                                />
                            </label>

                                <label>
                                    Country
                                    <select
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    required
                                    >
                                     <option value="">Select your country</option>

                                        {COUNTRY_LIST.map((c) => (
                                        <option key={c} value={c}>
                                        {c}
                                    </option>
                                  ))}
                            </select>
                        </label>
                            
                            <label>
                                Password
                                <input
                                    type='password'
                                    name='password'
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder='Enter a new password'
                                    required
                                    disabled={isSubmitting}
                                />
                            </label>

                            <div className='form-actions'>
                                <button type='submit' disabled={status.state === 'loading'}>
                                    {status.state === 'loading' ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                            <div className='form-actions'>
                                    <button type='button'
                                    className='delete-btn'
                                    onClick={handleDeleteAccount}
                                    disabled={isSubmitting}
                                >
                                    Delete My Account
                                </button>
                            </div>

                            {status.state !== 'idle' && (
                                <p
                                    className={
                                        'form-status ' +
                                            (status.state === 'error' ? 'form-status--error' : 'form-status--success')
                                            }
                                        role='status'
                                >
                                    {status.message}
                                </p>
                            )}
                        </form> 
                    </div>
                </PageSection>
            </div>
        </div>
    ); 
}