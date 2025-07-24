document.addEventListener('DOMContentLoaded', function () {
    const reportIssueLink = Array.from(document.querySelectorAll('a.nav-link')).find(a => a.textContent.includes('Report Issue'));
    const reportIssueModal = new bootstrap.Modal(document.getElementById('report-issue-modal'));

    reportIssueLink.addEventListener('click', function (event) {
        event.preventDefault();
        reportIssueModal.show();
    });

    document.getElementById('report-issue-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reporter-name').value;
        const email = document.getElementById('reporter-email').value;
        const description = document.getElementById('issue-description').value;
        
        const subject = `Issue Report from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nIssue:\n${description}`;
        
        window.location.href = `mailto:woaliur.rahmam.masum@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        reportIssueModal.hide();
    });

    document.getElementById('cancel-report').addEventListener('click', function() {
        reportIssueModal.hide();
    });
});