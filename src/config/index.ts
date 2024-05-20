


import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { config } from 'dotenv';
import ConfigVars from './interface';

config();

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;
const bool = (val: string | undefined, bool: boolean): boolean =>
  val == null ? bool : val == 'true';



const configuration: ConfigVars = {
  jwt: {
    secret: process.env.JWT_SECRET || 'seKOENVOEINLND234NFI',
    auth_secret: process.env.JWT_AUTH_SECRET || 'seKOENVOEINLND234ERIV84HR'
  }
};

const configFunction: ConfigFactory<ConfigVars> = () => configuration;
export default configFunction;
