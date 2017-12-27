const express = require('express');
const mapRouter = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Maps} = require('../models/models');

mapRouter.get('/', (req,res) => {
Maps
    .find()
    .exec()
    .then(maps => {
        res.json({
            maps: maps.map(map => map.mapRepr())
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

mapRouter.get('/:name', (req, res) => {
Maps
    .findOne({name: req.params.name})
    .then(map => {
        res.json({map: map.mapRepr()});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = mapRouter;

/* Overwatch Map Data. Inserted into MongoDB
const mapDocuments = [
    {
        mode: 'Assault', 
        name: 'Hanamura',
        location: 'near Tokyo, Japan',
        pictureName: 'hanamura',
        description: 'Hanamura is a well-preserved village of unassuming ' +
        'shops and quiet streets, known mostly for its idyllic cherry ' +
        'blossom festival every spring. But to those who know its history, ' +
        'Hanamura is the ancestral home of the Shimada ninja clan, which ' +
        'had grown over the centuries to become a powerful criminal ' +
        'organization. As its neighboring cities expanded, Hanamura was ' +
        'encircled, and eventually it was incorporated as a district within ' +
        'a larger city. For now, the imposing compound of the Shimada family ' +
        'lies empty, but that peace may soon be broken.',
        terrain: 'Residential area'
    },
    
    {
        mode: 'Assault',
        name: 'Horizon Lunar Colony',
        location: 'Luna (Earth\'s Moon',
        pictureName: 'horizon',
        description: 'Built as a first step towards humanity\'s renewed ' +
        'exploration of space, the Horizon Lunar Colony’s goal was to ' +
        'examine the effects of prolonged extraterrestrial habitation—on ' +
        'human and ape alike. The scientists\' research proved incredibly ' +
        'promising...until, suddenly, all contact and communications with ' +
        'the base were lost.',
        terrain: 'Modular base, lunar surface'
    },

    {
        mode: 'Assault',
        name: 'Temple of Anubis',
        location: 'Giza Plateau, Egypt',
        pictureName: 'templeofanubis',
        description: 'Nestled among the ancient ruins of the Giza Plateau ' +
        'on the outskirts of Cairo, the Temple of Anubis is one of many ' +
        'new excavations in the area. While most believe that the site ' +
        'is of interest for archaelogical reasons, it also hides the ' +
        'entrance to a research facility that extends deep beneath the ' +
        'earth. The facility is alleged to house an artificial ' +
        'intelligence, but the whole truth is known only to a select ' +
        'few. Not even the agents of Helix Security International who ' +
        'guard the facility know what they\'re protecting.',
        terrain: 'Temple'
    },

    {
        mode: 'Assault',
        name: 'Volskaya Industries',
        location: 'near St. Petersburg, Russia',
        pictureName: 'volskaya',
        description: 'Russia was one of the countries hit hardest by ' +
        'the Omnic Crisis, but during the rebuilding process, it rode ' +
        'the wave of the mechanized labor industry\'s revitalization ' +
        'and entered a period of rapid growth. However, after recent ' +
        'attacks from the long-dormant Siberian omnium, Russia has ' +
        'returned to war footing, guarding its sparkling cities with ' +
        'the massive, human-piloted Svyatogor mechs developed and ' +
        'produced by Volskaya Industries.',
        terrain: 'Machine construction zone'
    },

    {
        mode: 'Escort',
        name: 'Dorado',
        location: 'Veracruz, Mexico',
        pictureName: 'dorado',
        description: 'It is Festival de la Luz in Dorado, an annual ' +
        'celebration of the end of the Omnic Crisis and the period of ' +
        'darkness – both figurative and literal – that engulfed Mexico ' +
        'when the omnics destroyed much of the country’s power grid and ' +
        'infrastructure. But there is a new dawn, as LumériCo and its CEO, ' +
        'war hero and former president Guillermo Portero, are unveiling a ' +
        'string of fusion plants that promise to deliver clean, free energy ' +
        'to the Mexican people. \n' +       
        'The attacking team begins in Missión Dorado, a historic ' +
        'location famous for the sound of the ornamental bells that ' +
        'hang amidst its arches.',
        terrain: 'Town street'
    },

    {
        mode: 'Escort',
        name: 'Junkertown',
        location: 'Central Australia',
        pictureName: 'junkertown',
        description: 'Junkertown is an Escort map located in the harsh ' +
        'and unforgiving Australian Outback. Constructed from the remains ' +
        'of a destroyed omnium, it\'s now the home to a band of lawless ' +
        'scavengers known as the Junkers, led by their cutthroat Queen. ' +
        'When they aren’t pillaging the omnium\'s skeleton for anything ' +
        'of value, the Junkers blow off steam in the Scrapyard—a massive ' +
        'gladiatorial arena whose combatants fight for glory, ' +
        'riches...and to survive.',
        terrain: 'Shanty town, desert'
    },

    {
        mode: 'Escort',
        name: 'Route 66',
        location: 'Route 66, US Southwest',
        pictureName: 'route66',
        description: 'Though the travelers and road trippers who used ' +
        'to cross the US on historic Route 66 are gone, the Main Street ' +
        'of America still stands, a testament to a simpler time. ' +
        'The gas stations, roadside shops, and cafes have gone into disuse, ' +
        'and the fabled Deadlock Gorge is mostly seen from the comfort of ' +
        'transcontinental train cars. But amid the fading monuments of that ' +
        'earlier era, the outlaws of the Deadlock Gang are planning their ' +
        'biggest heist yet.',
        terrain: 'Desert road'
    },

    {
        mode: 'Escort',
        name: 'Watchpoint: Gibraltar',
        location: 'The Rock of Gibraltar',
        pictureName: 'watchpoint',
        description: 'At its height, Overwatch maintained a number of ' +
        'bases around the world, each with its own purpose: peacekeeping, '+
        'scientific research, or in the case of Watchpoint: Gibraltar, ' +
        'providing an orbital launch facility. The base was mothballed ' +
        'along with the rest of Overwatch\'s installations, but there ' +
        'have been recent reports of activity within the perimeter. ' +
        'Could this indicate the presence of former Overwatch agents, ' +
        'or is this the work of organizations with more nefarious intentions?',
        terrain: 'Research facility'
    },

    {
        mode: 'Hybrid',
        name: 'Blizzard World',
        location: 'Irvine, California',
        pictureName: 'blizzardWorld',
        description: 'Epic fun detected: Welcome to Blizzard World. \n' +
        'See your favorite gaming memories come to life in Overwatch\’s ' +
        'new hybrid map as you attack and defend the payload across ' +
        'Azeroth, Tristram, the Koprulu Sector, and beyond!',
        terrain: 'Theme park'
    },

    {
        mode: 'Hybrid',
        name: 'Eichenwalde',
        location: 'Outskirts of Stuttgart, Germany',
        pictureName: 'eichenwalde',
        description: 'Eichenwalde is located in the middle of the \n' + 
        'Black Forest. The town was the site of one of the most famous ' +
        'battles during the Omnic Crisis. It was here that the leader of ' +
        'the Crusaders, Balderich von Adler, and a handful of his best ' +
        'soldiers, including his pupil, Reinhardt Wilhelm, made a ' +
        'last stand against an advancing automaton army. Since Eichenwalde ' +
        'was in the way of a larger omnic advance to Stuttgart, the town ' +
        'was evacuated on October 11, from 3 to 8 o\'clock. ' +
        'Outnumbered and outgunned, almost all Crusaders were slain during ' +
        'the resulting combat, including the organizations leader. ' +
        'However, thanks to their valiant efforts, the German military ' +
        'was able to push back the omnic offensive and win the fight. ' +
        'In the present day, Eichenwalde lies abandoned, and the ' +
        'forest has slowly begun overtaking the village. However, ' +
        'the scars of war will never completely fade.',
        terrain: 'Town in forest'
    },

    {
        mode: 'Hybrid',
        name: 'Hollywood',
        location: 'Hollywood, California',
        pictureName: 'hollywood',
        description: 'Welcome to the glitz and glamour of Hollywood, ' +
        'California, where palm trees and fancy cars line the streets, ' +
        'and movie stars, directors, and high-powered studio executives ' +
        'rub shoulders for a chat and a drink at Galand\'s. Down the ' +
        'street from the Mandarin Theatre, Goldshire Studios\' omnic ' +
        'film auteur, HAL-Fred Glitchbot, has created his two latest films, ' +
        'They Come from Beyond the Moon and Six-Gun Killer, to varying ' +
        'amounts of critical and commercial acclaim. However, even ' +
        'Tinseltown has been gripped by anti-omnic sentiment, and the ' +
        'outspoken director has become a prime target in the escalating conflict.',
        terrain: 'Various movie sets'
    },

    {
        mode: 'Hybrid',
        name: 'King\'s Row',
        location: 'London, England',
        pictureName: 'kingsrow',
        description: 'King\'s Row is an upscale, cosmopolitan neighborhood ' +
        'of London, but just beneath its peaceful surface, tensions ' +
        'between omnics and humans are running high. While much of modern ' +
        'England was built on the backs of omnic laborers, they have been ' +
        'denied the basic rights that humans have, with most omnics forced ' +
        'to live in the dense, claustrophobic city-beneath-the-city known ' +
        'by some as "the Underworld." Of greater concern is that recent ' +
        'demonstrations by pro-omnic-rights protestors have resulted in ' +
        'violent clashes with the police, and a solution is nowhere in sight.',
        terrain: 'Narrow, cobblestone streets'
    },

    {
        mode: 'Hybrid',
        name: 'Numbani',
        location: 'Nigerian savanna',
        pictureName: 'numbani',
        description: 'Known as the "City of Harmony," Numbani is one of ' +
        'the few places where omnics and humans live as equals. This ' +
        'collaboration has led to the creation of one of the world\'s ' +
        'greatest and most technologically advanced cities in the short ' +
        'time since its establishment after the end of the Omnic Crisis. ' +
        'As part of this year\'s Unity Day festivities celebrating ' +
        'the city\'s founding, the gauntlet of the infamous Doomfist ' +
        'is being exhibited at the Numbani Heritage Museum.',
        terrain: 'Urban'
    },

    {
        mode: 'Control',
        name: 'Ilios',
        location: 'Greece',
        pictureName: 'ilios',
        description: 'Ilios is located in the Aegean sea of Greece, ' +
        'which is part of the Mediterranean Sea. \n' +
        'Situated atop a small island rising from the Aegean Sea, ' +
        'Ilios is a postcard-perfect Mediterranean town, with a bustling ' +
        'harborside, winding paths for rambling hillside strolls, and ' +
        'gorgeous vistas. It is the ideal vacation stop for people looking ' +
        'for a place to relax, or for those interested in exploring the ' +
        'ruins scattered at the top of the island, where many artifacts and ' +
        'relics of the ancient world have been recently unearthed. ' +
        'The ruins were declared an internationally protected heritage site. ' +
        'However, Talon attempted to steal the artifacts.',
        terrain: 'City area'
    },

    {
        mode: 'Control',
        name: 'Lijiang Tower',
        location: 'Lijiang, China',
        pictureName: 'lijiang',
        description: 'Lijiang Tower was built in the heart of a modern ' +
        'Chinese metropolis, its busy streets lined with stores, gardens, ' +
        'restaurants, and famous night markets, where foods from around ' +
        'the region are available at all hours. The tower itself is home ' +
        'to one of the leading companies in China\'s state-of-the-art ' +
        'space industry, Lucheng Interstellar, an organization with a ' +
        'long pioneering history that is currently pushing the boundaries ' +
        'of space exploration.',
        terrain: 'City area'
    },

    {
        mode: 'Control',
        name: 'Nepal',
        location: 'Himalayas, Nepal',
        pictureName: 'nepal',
        description: 'Years ago, a group of omnic robots experienced what ' +
        'they described as a spiritual awakening. They abandoned their ' +
        'programmed lives to establish a monastery high in the Himalayas, ' +
        'where like-minded omnics could gather to meditate on the nature ' +
        'of their existence. Led by their spiritual leader, ' +
        'Tekhartha Mondatta, they took over the ruins of an ancient ' +
        'monastery and turned it into the home of the Shambali, a place ' +
        'where omnics and humans alike make pilgrimages in the hopes of ' +
        'finding a greater truth.',
        terrain: 'Monastery'
    },

    {
        mode: 'Control',
        name: 'Oasis',
        location: 'Southern Iraq',
        pictureName: 'oasis',
        description: 'Oasis is one of the world\'s most advanced cities, ' +
        'a shining jewel rising from the Arabian Desert. A monument to ' +
        'human ingenuity and invention, researchers and academics from ' +
        'around the region came together to found a city dedicated to ' +
        'scientific progress without restraints. The city and its ' +
        'inhabitants are governed by the Ministries, a collection of ' +
        'brilliant minds who possess many secrets that have attracted ' +
        'the interest of powerful organizations from around the world.',
        terrain: 'City area'
    }
];

// Bulk insert these documents into MongoDB
Maps
.insertMany(mapDocuments)
.then(mapDocs => {
    if (mapDocs > 0) {
        console.dir(`${mapDocs} have successfuly been added`);
    }
})
.catch(err => {
    console.error(err);
});

*/