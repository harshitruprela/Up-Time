import express, { type Application } from 'express';
import bodyParser from 'body-parser';
import monitorRoutes from './src/routes/monitor_routes';
import { pingingService } from './src/service/pinger/pinger';

const app: Application = express();

let TimeOut = 5000
export const setTime = (time : number) => {
  console.log(time)
  TimeOut = time
}
app.use(bodyParser.json());

// Routes
app.use('/api', monitorRoutes);

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;


const Service = async () => {
  await pingingService(PORT)
  await Bun.sleep(TimeOut)
  console.log(`-----------------------------------------
                # TIME : ${TimeOut} #
              -------------------------------------------`)
  Service()
}

Service()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});