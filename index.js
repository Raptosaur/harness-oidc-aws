const AWS = require('aws-sdk');

async function assumeRoleWithOidc(roleArn, webIdentityToken, sessionName = 'oidc-session', durationSeconds = 3600) {
    const sts = new AWS.STS();
    const params = {
        RoleArn: roleArn,
        RoleSessionName: sessionName,
        WebIdentityToken: webIdentityToken,
        DurationSeconds: durationSeconds,
    };

    try {
        const data = await sts.assumeRoleWithWebIdentity(params).promise();
        return {
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken,
            expiration: data.Credentials.Expiration,
        };
    } catch (error) {
        throw new Error(`Failed to assume role: ${error.message}`);
    }
}

// For demonstration, read inputs from environment variables
(async () => {
    console.log(process.args);
    console.log(process.env);

    const roleArn = process.env.ROLE_ARN;
    const token = process.env.OIDC_TOKEN;
    const sessionName = process.env.SESSION_NAME || 'oidc-session';
    const durationSeconds = process.env.DURATION_SECONDS ? parseInt(process.env.DURATION_SECONDS, 10) : 3600;

    if (!roleArn || !token) {
        console.error('ROLE_ARN and OIDC_TOKEN environment variables are required.');
        process.exit(1);
    }

    try {
        const creds = await assumeRoleWithOidc(roleArn, token, sessionName, durationSeconds);
        console.log(JSON.stringify(creds, null, 2));
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
})();
