const https = require('https');
https.get('https://www.serebii.net/pokemongo/maxbattles.shtml', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const startIndex = data.indexOf('Current Max Battle Opponents');
    const endIndex = data.indexOf('List of Gigantamax Capable', startIndex);
    const segment = data.substring(startIndex, endIndex);
    const matches = segment.match(/\/pokemon\/\d{3}\.png/g);
    if(matches) {
       console.log([...new Set(matches)]);
    }
  });
});
