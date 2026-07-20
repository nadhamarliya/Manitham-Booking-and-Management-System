import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com', // 🎯 MUST BE EXACTLY THIS Domain, NO "://"
        port: 587,
        secure: false, 
        auth: {
            user: 'b278a7001@smtp-brevo.com', 
            pass: 'xsmtpsib-4d69920269bcdc3019585610aaecb47fb8a98d78576035cc50514295b11c82c3-JkHYb66N8jlYT5WR',          
        },
    });

    const mailOptions = {
        from: 'Manitham Portal <nadhamarli@gmail.com>', 
        to: options.to,
        subject: options.subject,
        html: options.html, 
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
