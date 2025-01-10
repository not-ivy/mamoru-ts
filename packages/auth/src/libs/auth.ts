import {Discord} from 'arctic';

const makeArctic = (client: string, secret: string, redirect: string) => new Discord(client, secret, redirect);

export default makeArctic;
