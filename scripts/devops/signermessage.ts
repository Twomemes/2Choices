import {getSigner} from '~/utils/contract';

(async () => {
  const signer = await getSigner(0);
  const message = 'hhh';
  const signature = await signer.signMessage(message);
  console.log({signature});
})();
