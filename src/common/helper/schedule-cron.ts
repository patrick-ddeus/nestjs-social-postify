import CronJob from 'cron';

const Cron = CronJob.CronJob;

export function schedule(date: Date) {
  const dateInstance = new Date(date);

  const job = new Cron(dateInstance, function () {
    console.log('PLAU', new Date());
  });

  job.start();
}
