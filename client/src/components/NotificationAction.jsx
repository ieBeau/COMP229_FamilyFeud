/**
 * @file NotificationAction.jsx
 * @author Pierre Moreau
 * @since 2025-11-27
 * @purpose Display a notification message after an action is completed.
*/

import PageSection from "./PageSection";

export const NotificationType = Object.freeze({
    ERROR: 'Error',
    SUCCESS: 'Success'
});

export const ActionType = Object.freeze({
    DELETE: 'deleted',
    EDIT: 'edited'
});

export default function NotificationAction({ type = Object.values(NotificationType)[0], action = Object.values(ActionType)[0], text, onClose }) {

    let header;
    let description1;
    let description2;

    switch (type) {
        case NotificationType.SUCCESS:
            header = 'Success';
            description1 = `${text} was successfully ${action}!`;
            break;
        case NotificationType.ERROR:
            header = 'Error!';
            const prompt = action === 'deleted' ? 'deleting' : action === 'edited' ? 'editing' : 'performing the action on';
            description1 = `There was an error ${prompt} ${text}.`;
            description2 = `Please try again.`;
            break;
        default:
            header = 'Info';
            description1 = `This action did not process successfully.`;
            break;
    }
    
    return (
        <div className="notification-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="notification-container">
                <PageSection title={header}>
                    {description1 ? <p>{description1}</p> : null}
                    {description2 ? <p>{description2}</p> : null}
                    <div className="notification-action-buttons">
                        <button className="primary-button" onClick={(e) => onClose(e)}>Close</button>
                    </div>
                </PageSection>
            </div>
        </div>
    );
};