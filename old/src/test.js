const API = require('./API');

const run = async () => {
	const res = JSON.parse(await API.getAntonym('Smart'));
	if(res.length > 0) {
		const antonym = res[0]['word'];
		console.log(`You are also ${antonym}`); 
	}
	const similar = JSON.parse(await API.getSimilar('Smart'))
	const similarWords = similar.map(sim => {
		return sim.word;
	});

	console.log('Other parts of you in the light:')
	console.log(similarWords.toString(','));

	const shadows = await Promise.all(similarWords.map(sim => {
	  return API.getAntonym(sim);
	}))

	const shadowsFiltered = shadows.map(shadow => {
		const shadowJson = JSON.parse(shadow);
		if(shadowJson.length > 0 && shadowJson[0]['word']) {
			return shadowJson[0]['word'];
		}
	})
	console.log(shadowsFiltered);
}

run();
