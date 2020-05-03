const request = require('request-promise');
const axios = require('axios');

class API {
    static getAntonym(word) {
        return request({
            url: `https://api.datamuse.com/words?rel_ant=${word}`,
            method: 'GET',
            auth: { user: LUMINATI.USERNAME, pass: LUMINATI.PASSWORD },
        });
    }

    static getSimilar(word) {
      return request({
        url: `https://api.datamuse.com/words?ml=${word}`,
        method: 'GET',
        auth: { user: LUMINATI.USERNAME, pass: LUMINATI.PASSWORD },
    });
    }
}

module.exports = API;
