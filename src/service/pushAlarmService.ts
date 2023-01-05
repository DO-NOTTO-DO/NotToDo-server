import Agenda from 'agenda';
import admin from 'firebase-admin';
import serviceAccount from '../../nottodo-firebase-admin.json';
import config from '../config';

// firebase setting
const firebaseKeys = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
});

// agenda setting
const agenda = new Agenda({
  db: { address: config.mongoURI, collection: 'pushAlarm' },
});

const pushAlarm = async (fcmToken: string) => {
  try {
    const message = {
      android: {
        notification: {
          title: '내일 실천할 낫투두를 작성해보세요!',
          body: '티끌 모아 태산이다 열심히 살자 아자아자 화이팅',
        },
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            alert: {
              title: '내일 실천할 낫투두를 작성해보세요!',
              body: '티끌 모아 태산이다 열심히 살자 아자아자 화이팅',
            },
          },
        },
      },
      token: fcmToken,
    };

    agenda.define('pushAlarm', async (job, done) => {
      admin
        .messaging()
        .send(message)
        .then(function (res) {
          console.log('Successfully sent message: : ', res);
        })
        .catch(function (err) {
          console.log('Error Sending message!!! : ', err);
        });
      job.repeatAt('8:55pm');
      await job.save();
      done();
    });
    
    const now = new Date();
    agenda.schedule(now, 'pushAlarm', null);
    agenda.start();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const PushAlarmService = {
  pushAlarm,
};

export default PushAlarmService;
