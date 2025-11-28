/**
 * @file VerifyAction.jsx
 * @author Pierre Moreau
 * @since 2025-11-27
 * @purpose Confirm or cancel a user action.
*/

import PageSection from "./PageSection";

export default function VerifyAction({ action, text, image, onConfirm, onCancel }) {
    
    return (
        <div className="notification-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="notification-container">
                <PageSection title="Confirm Action">
                    {image && <img src={image} alt="Item to verify" className="notification-avatar" />}
                    <p>Are you sure you want to {action} {text}?</p>
                    <p>This action cannot be undone.</p>
                    <div className="notification-action-buttons">
                        <button className="primary-button" onClick={(e) => onConfirm(e)}>Confirm</button>
                        <button className="cancel-button" onClick={() => onCancel()}>Cancel</button>
                    </div>
                </PageSection>
            </div>
        </div>
    );
};