const express = require('express');
const heroRouter = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Hero} = require('../models/models.js');

heroRouter.use(jsonParser);

heroRouter.get('/', (req,res) => {
    Hero
        .find()
        .exec()
        .then(heroes => {
            res.json({
                heroes: heroes.map(hero => hero.heroRepr())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

heroRouter.get('/:name', (req, res) => {
    Hero
        .findOne({name: req.params.name})
        .exec()
        .then(hero => {
            console.log('inside');
            res.json({hero: hero.heroRepr()});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

module.exports = heroRouter;

/* Overwatch Hero Data. Inserted into MongoDB
const heroDocuments = [
    {
        name: 'Ana',
        role: 'Support',
        overview: 'Ana’s versatile arsenal allows her to affect heroes ' +
        'all over the battlefield. Her Biotic Rifle rounds and Biotic ' +
        'Grenades heal allies and damage or impair enemies; her sidearm ' + 
        'tranquilizes key targets, and Nano Boost gives one of her comrades ' +  
        'a considerable increase in power.',
        realName: 'Ana Amari',
        age: '60',
        occupation: 'Bounty Hunter',
        baseOfOperations: 'Cairo, Egypt',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'ana',
        abilities: [
            {
                ability: 'Biotic Rifle',
                description: 'Ana\'s rifle shoots darts that can restore health ' +
                'to her allies or deal ongoing damage to her enemies. ' +
                'She can use the rifle\'s scope to zoom in on targets and ' +
                'make highly accurate shots.' 
            },
            {
                ability: 'Sleep Dart',
                description: 'Ana fires a dart from her sidearm, rendering an ' + 
                'enemy unconscious (though any damage will rouse them).'
            },
            {
                ability: 'Biotic Grenade',
                description: 'Ana tosses a biotic bomb that deals damage to ' +
                'enemies and heals allies in a small area of effect. Affected ' +
                'allies briefly receive increased healing from all sources, ' + 
                'while enemies caught in the blast cannot be healed for a few moments.'
            },
            {
                ability: 'Nano Boost',
                description: 'After Ana hits one of her allies with a combat boost, ' +
                'they deal more damage, and take less damage from enemies’ attacks.'
            }
        ]
    },

    {
        name: 'Bastion',
        role: 'Defense',
        overview: 'Repair protocols and the ability to transform between ' +
        'stationary Assault, mobile Recon and devastating Tank configurations ' +
        'provide Bastion with a high probability of victory.',
        realName: 'SST Laboratories Siege Automation E54',
        age: '30',
        occupation: 'Battle Automation',
        baseOfOperations: 'Unknown',
        affiliation: 'None',
        pictureName: 'bastion',
        abilities: [
            {
                ability: 'Configuration: Recon',
                description: 'In Recon mode, Bastion is fully mobile, outfitted with ' +
                'a submachine gun that fires steady bursts of bullets at medium range.'
            },
            {
                ability: 'Configuration: Sentry',
                description: 'In Sentry mode, Bastion is a stationary powerhouse ' +
                'equipped with a gatling gun capable of unleashing a hail of bullets. ' +
                'The gun\'s aim can be "walked" across multiple targets, dealing ' +
                'devastating damage at short to medium range.'
            },
            {
                ability: 'Reconfigure',
                description: 'Bastion transforms between its two primary combat ' +
                'modes to adapt to battlefield conditions.'
            },
            {
                ability: 'Self-Repair',
                description: 'Bastion restores its health; it cannot fire ' +
                'weapons while the repair process is in effect.'
            },
            {
                ability: 'Configuration: Tank',
                description: 'In Tank mode, Bastion extends wheeled treads and ' +
                'a powerful long-range cannon. The cannon’s explosive shells ' +
                'demolish targets in a wide blast radius, but Bastion can ' +
                'only remain in this mode for a limited time.'
            }
        ]
    },

    {
        name: 'D.Va',
        role: 'Tank',
        overview: 'D.Va’s mech is nimble and powerful—its twin Fusion Cannons' +
        'blast away with autofire at short range, and she can use its ' +
        'Boosters to barrel over enemies and obstacles, or deflect ' +
        'attacks with her projectile-dismantling Defense Matrix.',
        realName: 'Hana Song',
        age: '19',
        occupation: 'Pro Gamer (former), Mech Pilot',
        baseOfOperations: 'Busan, South Korea',
        affiliation: 'Mobile Exo-Force of the Korean Army',
        pictureName: 'dva',
        abilities: [
            {
                ability: 'Fusion Cannons',
                description: 'D.Va\'s mech is equipped with twin short-range ' +
                'rotating cannons. They lay down continuous, high-damage fire ' +
                'without needing to reload, but slow D.Va’s movement ' +
                'while they’re active.'
            },
            {
                ability: 'Light Gun',
                description: 'While outside of her mech, D.Va can continue ' +
                'the fight with a mid-range automatic blaster.'
            },
            {
                ability: 'Boosters',
                description: 'D.Va’s mech launches into the air, her momentum ' +
                'carrying her forward. She can turn and change directions ' +
                'or barrel through her enemies, knocking them back.'
            },
            {
                ability: 'Defense Matrix',
                description: 'D.Va can maintain this forward-facing targeting ' +
                'array for a short period of time; while active, ' +
                'it\'ll stop incoming projectiles.'
            },
            {
                ability: 'Micro Missles',
                description: 'D.Va launches a volley of explosive rockets.'
            },
            {
                ability: 'Self-Destruct',
                description: 'D.Va ejects from her mech and sets its ' +
                'reactor to explode, dealing massive damage to nearby opponents.'
            },
            {
                ability: 'Call Mech',
                description: 'If her armored battle suit is destroyed, ' +
                'D.Va can call down a fresh mech and return to the fray.'
            }
        ]
    },

    {
        name: 'Doomfist',
        role: 'Offense',
        overview: 'Doomfist’s cybernetics make him a highly-mobile, powerful ' +
        'frontline fighter. In addition to dealing ranged damage with his ' +
        'Hand Cannon, Doomfist can slam the ground, knock enemies into the ' +
        'air and off balance, or charge into the fray with his Rocket Punch. ' +
        'When facing a tightly packed group, Doomfist leaps out of view, ' +
        'then crashes down to earth with a spectacular Meteor Strike.',
        realName: 'Akande Ogundimu',
        age: '45',
        occupation: 'Mercenary',
        baseOfOperations: 'Oyo, Nigeria',
        affiliation: 'Talon',
        pictureName: 'doomfist',
        abilities: [
            {
                ability: 'Hand Cannon',
                description: 'Doomfist fires a short-range burst from the ' +
                'knuckles of his fist. Its ammunition is automatically ' +
                'regenerated over a short time.'
            },
            {
                ability: 'Seismic Slam',
                description: 'Doomfist leaps forward and smashes into the ' +
                'ground, knocking nearby enemies toward him.'
            },
            {
                ability: 'Rising Uppercut',
                description: 'Doomfist uppercuts enemies in front of him into the air.'
            },
            {
                ability: 'Rocket Punch',
                description: 'After charging up, Doomfist lunges forward and knocks ' +
                'an enemy back, dealing additional damage if they impact a wall.'
            },
            {
                ability: 'The Best Defense...',
                description: 'Doomfist generates temporary personal shields when he ' +
                'deals ability damage.'
            },
            {
                ability: 'Meteor Strike',
                description: 'Doomfist leaps into the sky, then crashes to the ' +
                'ground, dealing significant damage.'
            }
        ]
    },

    {
        name: 'Genji',
        role: 'Offense',
        overview: 'Genji flings precise and deadly Shuriken at his targets, ' +
        'and uses his technologically-advanced katana to deflect ' +
        'projectiles or deliver a Swift Strike that cuts down enemies.',
        realName: 'Genji Shimada',
        age: '35',
        occupation: 'Adventurer',
        baseOfOperations: 'Shambali Monastery, Nepal',
        affiliation: 'Shimada Clan (formerly), Overwatch (formerly)',
        pictureName: 'genji',
        abilities: [
            {
                ability: 'Shuriken',
                description: 'Genji looses three deadly throwing stars in ' +
                'quick succession. Alternatively, he can throw ' +
                'three shuriken in a wider spread.'
            },
            {
                ability: 'Deflect',
                description: 'With lightning-quick swipes of his sword, Genji ' +
                'reflects an oncoming projectile and sends ' +
                'it rebounding towards his opponent.'
            },
            {
                ability: 'Swift Strike',
                description: 'Genji darts forward, slashing with his katana ' +
                'and passing through foes in his path. If Genji eliminates ' +
                'a target, he can instantly use this ability again.'
            },
            {
                ability: 'Dragonblade',
                description: 'Genji brandishes his katana for a brief period ' +
                'of time. Until he sheathes his sword, Genji can ' +
                'deliver killing strikes to any targets within his reach.'
            }
        ]
    },

    {
        name: 'Hanzo',
        role: 'Defense',
        overview: 'Hanzo’s versatile arrows can reveal his enemies or fragment ' +
        'to strike multiple targets. He can scale walls to fire his bow ' +
        'from on high, or summon a titanic spirit dragon.',
        realName: 'Hanzo Shimada',
        age: '38',
        occupation: 'Mercenary, Assassin',
        baseOfOperations: 'Hanamura, Japan (formerly)',
        affiliation: 'Shimada Clan',
        pictureName: 'hanzo',
        abilities: [
            {
                ability: 'Storm Bow',
                description: 'Hanzo nocks and fires an arrow at his target.'
            },
            {
                ability: 'Sonic Arrow',
                description: 'Hanzo launches an arrow that contains a sonar ' +
                'tracking device. Any enemy within its detection radius is ' +
                'visibly marked, making them easier for Hanzo and his allies ' +
                'to hunt down.'
            },
            {
                ability: 'Scatter Arrow',
                description: 'Hanzo shoots a fragmenting arrow that ricochets ' +
                'off walls and objects and can strike multiple targets at once.'
            },
            {
                ability: 'Dragonstrike',
                description: 'Hanzo summons a Spirit Dragon which travels ' +
                'through the air in a line. It passes through walls in ' +
                'its way, devouring any enemies it encounters.'
            }
        ]
    },

    {
        name: 'Junkrat',
        role: 'Defense',
        overview: 'Junkrat’s area-denying armaments include a Frag Launcher ' +
        'that lobs bouncing grenades, Concussion Mines that send ' +
        'enemies flying, and Steel Traps that stop foes dead in their tracks.',
        realName: 'Jamison Fawkes',
        age: '25',
        occupation: 'Anarchist, Thief, Demolitionist, Mercenary, Scavenger',
        baseOfOperations: 'Junkertown, Australia (formerly)',
        affiliation: 'Junkers (formerly)',
        pictureName: 'junkrat',
        abilities: [
            {
                ability: 'Frag Launcher',
                description: 'Junkrat\'s Frag Launcher lobs grenades ' +
                'a significant distance. They bounce to reach their ' +
                'destination, and blow up when they strike an enemy.'
            },
            {
                ability: 'Concussion Mine',
                description: 'After placing one of his homemade Concussion ' +
                'Mines, Junkrat can trigger it to damage enemies and send ' +
                'them flying... or propel himself through the air.'
            },
            {
                ability: 'Steel Trap',
                description: 'Junkrat tosses out a giant, metal-toothed ' +
                'trap. Should an enemy wander too close to the trap, ' +
                'it clamps on, injuring and immobilizing them.'
            },
            {
                ability: 'Total Mayhem',
                description: 'Junkrat\'s deranged sense of humor persists ' +
                'past his death. If killed, he drops several live grenades.'
            },
            {
                ability: 'RIP-Tire',
                description: 'Junkrat revs up a motorized tire bomb and ' +
                'sends it rolling across the battlefield, climbing over ' +
                'walls and obstacles. He can remotely detonate the RIP-Tire ' +
                'to deal serious damage to enemies caught in the blast, ' +
                'or just wait for it to explode on its own.'
            }
        ]
    },

    {
        name: 'Lucio',
        role: 'Support',
        overview: 'On the battlefield, Lúcio’s cutting-edge Sonic Amplifier ' +
        'buffets enemies with projectiles and knocks foes back with ' +
        'blasts of sound. His songs can both heal his team or boost ' +
        'their movement speed, and he can switch between tracks on the fly.',
        realName: 'Lúcio Correia dos Santos',
        age: '26',
        occupation: 'DJ, Freedom Fighter',
        baseOfOperations: 'Rio de Janeiro, Brazil',
        affiliation: 'None',
        pictureName: 'lucio',
        abilities: [
            {
                ability: 'Sonic Amplifier',
                description: 'Lúcio can hit his enemies with sonic ' +
                'projectiles or knock them back with a blast of sound.'
            },
            {
                ability: 'Crossfade',
                description: 'Lúcio continuously energizes himself—and ' +
                'nearby teammates—with music. He can switch between ' +
                'two songs: one amplifies movement speed, while the ' +
                'other regenerates health.'
            },
            {
                ability: 'Amp it up',
                description: 'Lúcio increases the volume on his speakers, ' +
                'boosting the effects of his songs.'
            },
            {
                ability: 'Sound Barrier',
                description: 'Protective waves radiate out from ' +
                'Lúcio’s Sonic Amplifier, briefly providing him and ' +
                'nearby allies with personal shields.'
            }
        ]
    },

    {
        name: 'McCree',
        role: 'Offense',
        overview: 'Armed with his Peacekeeper revolver, McCree takes ' +
        'out targets with deadeye precision and dives out of ' +
        'danger with eagle-like speed.',
        realName: 'Jesse McCree',
        age: '37',
        occupation: 'Bounty Hunter',
        baseOfOperations: 'Santa Fe, New Mexico, USA',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'mccree',
        abilities: [
            {
                ability: 'Peacekeeper',
                description: 'McCree fires off a round from his trusty ' +
                'six-shooter. He can fan the Peacekeeper’s hammer to ' +
                'swiftly unload the entire cylinder.'
            },
            {
                ability: 'Combat Roll',
                description: 'McCree dives in the direction he’s moving, ' +
                'effortlessly reloading his Peacekeeper in the process.'
            },
            {
                ability: 'Flashbang',
                description: 'McCree heaves a blinding grenade that explodes ' +
                'shortly after it leaves his hand. The blast staggers ' +
                'enemies in a small radius.'
            },
            {
                ability: 'Deadeye',
                description: 'Focus. Mark. Draw. McCree takes a few '+
                'precious moments to aim; when he’s ready to fire, he ' +
                'shoots every enemy in his line of sight. The weaker his ' +
                'targets are, the faster he’ll line up a killshot.'
            }
        ]
    },

    {
        name: 'Mei',
        role: 'Defense',
        overview: 'Mei’s weather-altering devices slow opponents and ' +
        'protect locations. Her Endothermic Blaster unleashes damaging ' +
        'icicles and frost streams, and she can Cryo-Freeze herself ' +
        'to guard against counterattacks, or obstruct the opposing ' +
        'team\'s movements with an Ice Wall.',
        realName: 'Mei-Ling Zhou',
        age: '31',
        occupation: 'Climatologist, Adventurer',
        baseOfOperations: 'Xi\'an, China (formerly)',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'mei',
        abilities: [
            {
                ability: 'Endothermic Blaster',
                description: 'Mei’s blaster unleashes a concentrated, ' +
                'short-range stream of frost that damages, slows, and ' +
                'ultimately freezes enemies in place. Mei can also use ' +
                'her blaster to shoot icicle-like projectiles at medium range.'
            },
            {
                ability: 'Cyro-Freeze',
                description: 'Mei instantly surrounds herself with a block ' +
                'of thick ice. She heals and ignores damage while encased, ' +
                'but cannot move or use abilities.'
            },
            {
                ability: 'Ice Wall',
                description: 'Mei generates an enormous ice wall that ' +
                'obstructs lines of sight, stops movement, and blocks attacks.'
            },
            {
                ability: 'Blizzard',
                description: 'Mei deploys a weather-modification drone ' +
                'that emits gusts of wind and snow in a wide area. Enemies ' +
                'caught in the blizzard are slowed and take damage; those ' +
                'who linger too long are frozen solid.'
            }
        ]
    },

    {
        name: 'Mercy',
        role: 'Support',
        overview: 'Mercy’s Valkyrie Suit helps keep her close to teammates ' +
        'like a guardian angel; healing, resurrecting or strengthening ' +
        'them with the beams emanating from her Caduceus Staff.',
        realName: 'Angela Ziegler',
        age: '37',
        occupation: 'Field Medic, First Responder',
        baseOfOperations: 'Zürich, Switzerland',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'mercy',
        abilities: [
            {
                ability: 'Caduceus Staff',
                description: 'Mercy engages one of two beams that connect to ' +
                'an ally. By maintaining the beams, she can either restore ' +
                'that ally’s health or increase the amount of damage they deal.'
            },
            {
                ability: 'Caduceus Blaster',
                description: 'Mercy shoots a round from her sidearm.'
            },
            {
                ability: 'Guardian Angel',
                description: 'Mercy flies towards a targeted ally, allowing ' +
                'her to reach them quickly and provide assistance in crucial moments.'
            },
            {
                ability: 'Resurrect',
                description: 'Mercy brings a dead ally back into the ' +
                'fight with full health.'
            },
            {
                ability: 'Angelic Descent',
                description: 'Propelled by her Valkyrie suit, Mercy ' +
                'slows the speed of her descent from great heights.'
            },
            {
                ability: 'Valkyrie',
                description: 'Gain the ability to fly. Mercy’s abilities are enhanced.'
            }
        ]
    },

    {
        name: 'Orisa',
        role: 'Tank',
        overview: 'Orisa serves as the central anchor of her team, ' +
        'and defends her teammates from the frontline with a protective ' +
        'barrier. She can attack from long range, fortify her own defenses, ' +
        'launch graviton charges to slow and move enemies, and deploy ' +
        'a Supercharger to boost the damage output of multiple allies at once.',
        realName: 'Orisa',
        age: '1 month',
        occupation: 'Guardian Robot',
        baseOfOperations: 'Numbani',
        affiliation: 'None',
        pictureName: 'orisa',
        abilities: [
            {
                ability: 'Fusion Driver',
                description: 'Orisa’s automatic projectile cannon delivers ' +
                'sustained damage, but slows her movement while she fires it.'
            },
            {
                ability: 'Fortify',
                description: 'Orisa temporarily reduces damage she takes, ' +
                'and cannot be affected by action-impairing effects.'
            },
            {
                ability: 'Halt',
                description: 'Orisa launches a graviton charge which ' +
                'she can detonate, slowing nearby enemies and ' +
                'pulling them towards the explosion.'
            },
            {
                ability: 'Protective Barrier',
                description: 'Orisa throws out a stationary barrier that ' +
                'can protect her and her allies from enemy fire.'
            },
            {
                ability: 'Supercharger',
                description: 'Orisa deploys a device to increase damage ' +
                'inflicted by allies within her line of sight.'
            }
        ]
    },

    {
        name: 'Pharah',
        role: 'Offense',
        overview: 'Soaring through the air in her combat armor, and ' +
        'armed with a launcher that lays down high-explosive rockets, ' +
        'Pharah is a force to be reckoned with.',
        realName: 'Fareeha Amari',
        age: '32',
        occupation: 'Security Chief',
        baseOfOperations: 'Giza, Egypt',
        affiliation: 'Helix Security International',
        pictureName: 'pharah',
        abilities: [
            {
                ability: 'Rocket Launcher',
                description: 'Pharah’s primary weapon launches ' +
                'rockets that deal significant damage in a wide blast radius.'
            },
            {
                ability: 'Jump Jet',
                description: 'Propelled by her suit’s thrusters, ' +
                'Pharah soars high into the air.'
            },
            {
                ability: 'Concussive Blast',
                description: 'Pharah looses a wrist rocket that knocks ' +
                'back any enemies it strikes.'
            },
            {
                ability: 'Barrage',
                description: 'Pharah directs a continuous salvo of ' +
                'mini-rockets to destroy groups of enemies.'
            }
        ]
    },

    {
        name: 'Reaper',
        role: 'Offense',
        overview: 'Hellfire Shotguns, the ghostly ability to become ' +
        'immune to damage, and the power to step between shadows ' +
        'make Reaper one of the deadliest beings on Earth.',
        realName: 'Unknown',
        age: 'Unknown',
        baseOfOperations: 'Unknown',
        occupation: 'Unknown',
        affiliation: 'Unknown',
        pictureName: 'reaper',
        abilities: [
            {
                ability: 'Hellfire Shotguns',
                description: 'Reaper tears enemies apart with twin shotguns.'
            },
            {
                ability: 'Wraith Form',
                description: 'Reaper becomes a shadow for a short period ' +
                'of time. While in this form, he takes no damage and is ' +
                'able to pass through enemies, but cannot fire his ' +
                'weapons or use other abilities.'
            },
            {
                ability: 'Shadow Step',
                description: 'After marking a destination, Reaper ' +
                'disappears and reappears at that location.'
            },
            {
                ability: 'Death Blossom',
                description: 'In a blur of motion, Reaper empties ' +
                'both Hellfire Shotguns at breakneck speed, dealing ' +
                'massive damage to all nearby enemies.'
            }
        ]
    },

    {
        name: 'Reinhardt',
        role: 'Tank',
        overview: 'Clad in powered armor and swinging his hammer, ' +
        'Reinhardt leads a rocket-propelled charge across the ' +
        'battleground and defends his squadmates with a massive energy barrier.',
        realName: 'Reinhardt Wilhelm',
        age: '61',
        occupation: 'Adventurer',
        baseOfOperations: 'Stuttgart, Germany',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'reinhardt',
        abilities: [
            {
                ability: 'Rocket Hammer',
                description: 'Reinhardt’s Rocket Hammer is an exemplary ' +
                'melee weapon, able to deal punishing damage in a wide ' +
                'arc with every swing.'
            },
            {
                ability: 'Barrier Field',
                description: 'Reinhardt projects a broad, forward-facing ' +
                'energy barrier, which can absorb substantial damage ' +
                'before it is destroyed. Though Reinhardt can protect ' +
                'himself and his companions behind the barrier, he cannot ' +
                'attack while sustaining it.'
            },
            {
                ability: 'Charge',
                description: 'Reinhardt charges forth in a straight line, ' +
                'pinning the first enemy in his path and knocking others ' +
                'aside. If he collides with a wall, the foe he’s carrying ' +
                'suffers extreme damage.'
            },
            {
                ability: 'Fire Strike',
                description: 'By whipping his Rocket Hammer forward, ' +
                'Reinhardt slings a flaming projectile which pierces ' +
                'and damages any enemies it touches.'
            },
            {
                ability: 'Earthshatter',
                description: 'Reinhardt forcefully slams his Rocket Hammer ' +
                'into the ground, knocking down and damaging all enemies ' +
                'in front of him.'
            }
        ]
    },

    {
        name: 'Roadhog',
        role: 'Tank',
        overview: 'Roadhog uses his signature Chain Hook to pull his ' +
        'enemies close before shredding them with blasts from his Scrap Gun. ' +
        'He’s hardy enough to withstand tremendous damage, and can recover ' +
        'his health with a short breather.',
        realName: 'Mako Rutledge',
        age: '48',
        occupation: 'Enforcer (formerly), Bodyguard',
        baseOfOperations: 'Junkertown, Australia (formerly)',
        affiliation: 'Junkers (formerly)',
        pictureName: 'roadhog',
        abilities: [
            {
                ability: 'Scrap Gun',
                description: 'Roadhog\'s Scrap Gun fires short-range ' +
                'blasts of shrapnel with a wide spread. Alternatively, ' +
                'it can launch a shrapnel ball that detonates farther away, ' +
                'scattering metal fragments from the point of impact.'
            },
            {
                ability: 'Take A Breather',
                description: 'Roadhog restores a chunk of his health ' +
                'over a brief period of time.'
            },
            {
                ability: 'Chain Hook',
                description: 'Roadhog hurls his chain at a target; ' +
                'if it catches, he yanks them into close range.'
            },
            {
                ability: 'Whole Hog',
                description: 'After cramming a top-loader onto his ' +
                'Scrap Gun, Roadhog pours in ammo. For a short time, ' +
                'he can crank out a stream of shrapnel that knocks back enemies.'
            }
        ]
    },

    {
        name: 'Soldier: 76',
        role: 'Offense',
        overview: 'Armed with cutting-edge weaponry, including an ' +
        'experimental pulse rifle that’s capable of firing spirals ' +
        'of high-powered Helix Rockets, Soldier: 76 has the speed ' +
        'and support know-how of a highly trained warrior.',
        realName: 'Unknown',
        age: 'Unknown',
        occupation: 'Vigilante',
        baseOfOperations: 'Unknown',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'soldier76',
        abilities: [
            {
                ability: 'Heavy Pulse Rifle',
                description: 'Soldier: 76’s rifle remains particularly ' +
                'steady while unloading fully-automatic pulse fire.'
            },
            {
                ability: 'Helix Rockets',
                description: 'Tiny rockets spiral out of Soldier: 76\'s ' +
                'Pulse Rifle in a single burst. The rockets\' explosion ' +
                'damages enemies in a small radius.'
            },
            {
                ability: 'Sprint',
                description: 'Whether he needs to evade a firefight or ' +
                'get back into one, Soldier: 76 can rush ahead in a ' +
                'burst of speed. His sprint ends if he takes an action ' +
                'other than charging forward.'
            },
            {
                ability: 'Biotic Field',
                description: 'Soldier: 76 plants a biotic emitter on ' +
                'the ground. Its energy projection restores health to 76 ' +
                'and any of his squadmates within the field.'
            },
            {
                ability: 'Tactical Visor',
                description: 'Soldier: 76’s pinpoint targeting visor “locks” ' +
                'his aim on the threat closest to his crosshairs. ' +
                'If an enemy leaves his line of sight, Soldier: 76 ' +
                'can quickly switch to another target.'
            }
        ]
    },

    {
        name: 'Sombra',
        role: 'Offense',
        overview: 'Stealth and debilitating attacks make Sombra a ' +
        'powerful infiltrator. Her hacking can disrupt her enemies, ' +
        'ensuring they\'re easier to take out, while her EMP provides ' +
        'the upper hand against multiple foes at once. ' +
        'Sombra\'s ability to Translocate and camouflage herself makes ' +
        'her a hard target to pin down.',
        realName: '░░░░░░',
        age: '30',
        occupation: 'Hacker',
        baseOfOperations: 'Dorado, Mexico',
        affiliation: 'Talon, Los Muertos (former)',
        pictureName: 'sombra',
        abilities: [
            {
                ability: 'Machine Pistol',
                description: 'Sombra’s fully-automatic machine pistol ' +
                'fires in a short-range spread.'
            },
            {
                ability: 'Hack',
                description: 'Sombra hacks enemies to temporarily ' +
                'stop them from using their abilities, or hacks first ' +
                'aid kits to make them useless to her opponents.'
            },
            {
                ability: 'Stealth',
                description: 'Sombra becomes invisible for a short ' +
                'period of time, during which her speed is boosted ' +
                'considerably. Attacking, using offensive abilities, ' +
                'or taking damage disables her camouflage.'
            },
            {
                ability: 'Translocator',
                description: 'Sombra tosses out a translocator beacon. ' +
                'She can instantly return to the beacon’s location ' +
                'while it is active (including when it’s in mid-flight).'
            },
            {
                ability: 'EMP',
                description: 'Sombra discharges electromagnetic energy ' +
                'in a wide radius, destroying enemy barriers and shields ' +
                'and hacking all opponents caught in the blast.'
            }
        ]
    },

    {
        name: 'Symmetra',
        role: 'Support',
        overview: 'Symmetra utilizes her light-bending Photon Projector ' +
        'to dispatch adversaries, shield her associates, construct ' +
        'teleportation pads and deploy particle-blasting Sentry Turrets.',
        realName: 'Satya Vaswani',
        age: '28',
        occupation: 'Architech',
        baseOfOperations: 'Utopaea, India',
        affiliation: 'Vishkar Corporation',
        pictureName: 'symmetra',
        abilities: [
            {
                ability: 'Photon Projector',
                description: 'Symmetra’s weapon emits a short-range beam ' +
                'that homes in on a nearby enemy, dealing continuous damage ' +
                'that increases the longer it is connected. The projector ' +
                'can also release a charged energy ball that deals high damage.'
            },
            {
                ability: 'Sentry Turret',
                description: 'Symmetra sets up a small turret that ' +
                'automatically fires speed-reducing blasts at the nearest ' +
                'enemy within range. Several turrets can be built on the ' +
                'battlefield at once.'
            },
            {
                ability: 'Photon Barrier',
                description: 'Symmetra projects a moving barrier that ' +
                'absorbs damage as it travels forward.'
            },
            {
                ability: 'Teleporter',
                description: 'Symmetra places a teleporter exit pad ' +
                'at her current location, and connects it to a teleporter ' +
                'entry pad at her team’s starting point. Allies can travel ' +
                'through the entry pad to the exit pad instantly, enabling ' +
                'them to return to the fight swiftly after being defeated.'
            },
            {
                ability: 'Shield Generator',
                description: 'Symmetra deploys a wide-radius generator ' +
                'that provides increased shielding to her entire team.'
            }
        ]
    },

    {
        name: 'Torbjörn',
        role: 'Defense',
        overview: 'Torbjörn\'s extensive arsenal includes a rivet gun ' +
        'and hammer, as well as a personal forge that he can use to build ' +
        'upgradeable turrets and dole out protective armor packs.',
        realName: 'Torbjörn Lindholm',
        age: '57',
        occupation: 'Weapons Designer',
        baseOfOperations: 'Gothenburg, Sweden',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'torbjorn',
        abilities: [
            {
                ability: 'Rivet Gun',
                description: 'Torbjörn fires rivets at long range, or ' +
                'ejects molten metal from his gun in a short, close-range burst.'
            },
            {
                ability: 'Forge Hammer',
                description: 'Torbjörn uses his multipurpose hammer to ' +
                'build, upgrade and repair turrets. In a pinch, it can ' +
                'also be swung as a weapon.'
            },
            {
                ability: 'Build Turret',
                description: 'Torbjörn constructs an enemy-tracking ' +
                'autocannon. He can use his Forge Hammer to repair or ' +
                'upgrade it, increasing its health and adding a second ' +
                'cannon barrel and a rocket launcher.'
            },
            {
                ability: 'Armor Pack',
                description: 'Torbjörn deploys an armor upgrade; either he ' +
                'or his allies can pick it up to absorb some damage.'
            },
            {
                ability: 'Molten Core',
                description: 'After overheating his personal forge, ' +
                'Torbjörn gains a significant amount of armor and scrap. ' +
                'He also attacks (and builds and repairs turrets) far ' +
                'faster than normal.'
            }
        ]
    },

    {
        name: 'Tracer',
        role: 'Offense',
        overview: 'Toting twin pulse pistols, energy-based time bombs, ' +
        'and rapid-fire banter, Tracer is able to "blink" through space ' +
        'and rewind her personal timeline as she battles to right wrongs ' +
        'the world over.',
        realName: 'Lena Oxton',
        age: '26',
        occupation: 'Adventurer',
        baseOfOperations: 'London, England',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'tracer',
        abilities: [
            {
                ability: 'Pulse Pistols',
                description: 'Tracer rapid-fires both of her pistols.',
            },
            {
                ability: 'Blink',
                description: 'Tracer zips horizontally through space ' +
                'in the direction she’s moving, and reappears several ' +
                'yards away. She stores up to three charges of the ' +
                'blink ability and generates more every few seconds.'
            },
            {
                ability: 'Recall',
                description: 'Tracer bounds backward in time, returning ' +
                'her health, ammo and position on the map to precisely ' +
                'where they were a few seconds before.'
            },
            {
                ability: 'Pulse Bomb',
                description: 'Tracer lobs a large bomb that adheres to ' +
                'any surface or unfortunate opponent it lands on. ' +
                'After a brief delay, the bomb explodes, dealing ' +
                'high damage to all enemies within its blast radius.'
            }
        ]
    },

    {
        name: 'Widowmaker',
        role: 'Defense',
        overview: 'Widowmaker equips herself with whatever it takes ' +
        'to eliminate her targets, including mines that dispense ' +
        'poisonous gas, a visor that grants her squad infra-sight, ' +
        'and a powerful sniper rifle that can fire in fully-automatic mode.',
        realName: 'Amélie Lacroix',
        age: '33',
        occupation: 'Assassin',
        baseOfOperations: 'Annecy, France',
        affiliation: 'Talon',
        pictureName: 'widowmaker',
        abilities: [
            {
                ability: 'Widow\'s Kiss',
                description: 'Widowmaker\’s versatile sniper rifle is ' +
                'ideal for scope-aimed shots at distant targets. ' +
                'Should targets close to medium range, the rifle can also ' +
                'be fired in fully-automatic mode.'
            },
            {
                ability: 'Grappling Hook',
                description: 'Widowmaker launches a grappling hook towards ' +
                'the location she’s aiming at – when the hook connects ' +
                'with a scalable surface, she’s quickly drawn towards it, ' +
                'allowing her to expand her view of the battlefield ' +
                'and evade or flank targets.'
            },
            {
                ability: 'Venom Mine',
                description: 'Widowmaker adheres a swiftly-arming venom ' +
                'mine to nearly any surface. When a target wanders ' +
                'within range of the mine’s motion trigger, it explodes, ' +
                'delivering poison gas to any enemies in the vicinity.'
            },
            {
                ability: 'Infra Sight',
                description: 'Widowmaker\'s recon visor allows her to ' +
                'see the heat signatures of her targets through walls ' +
                'and objects for a moderate amount of time. This enhanced ' +
                'vision is shared with her allies.'
            }
        ]
    },

    {
        name: 'Winston',
        role: 'Tank',
        overview: 'Winston wields impressive inventions—a jump pack, ' +
        'electricity-blasting Tesla Cannon, portable shield projector ' +
        'and more—with literal gorilla strength.',
        realName: 'Winston',
        age: '29',
        occupation: 'Scientist, Adventurer',
        baseOfOperations: 'Horizon Lunar Colony (formerly)',
        affiliation: 'Overwatch (formerly)',
        pictureName: 'winston',
        abilities: [
            {
                ability: 'Tesla Cannon',
                description: 'Winston’s weapon fires a short-range ' +
                'electric barrage for as long as he holds down the trigger.'
            },
            {
                ability: 'Jump Pack',
                description: 'Assisted by his energy pack, Winston lunges ' +
                'through the air, dealing significant damage and staggering ' +
                'nearby enemies when he lands.'
            },
            {
                ability: 'Barrier Protector',
                description: 'Winston’s barrier projector extends a ' +
                'bubble-shaped field that absorbs damage until it\'s ' +
                'destroyed. Allies protected by the barrier can return ' +
                'fire from within it.'
            },
            {
                ability: 'Primal Rage',
                description: 'Winston embraces his animal nature, ' +
                'significantly boosting his health and making him very ' +
                'difficult to kill, strengthening his melee attack, and ' +
                'allowing him to use his Jump Pack ability more frequently. ' +
                'While raging, Winston can only make melee and Jump Pack attacks.'
            }
        ]
    },

    {
        name: 'Zarya',
        role: 'Tank',
        overview: 'Deploying powerful personal barriers that convert ' +
        'incoming damage into energy for her massive Particle Cannon, ' +
        'Zarya is an invaluable asset on the front lines of any battle.',
        realName: 'Aleksandra Zaryanova',
        age: '28',
        occupation: 'Soldier',
        baseOfOperations: 'Krasnoyarsk Front, Russia',
        affiliation: 'Russian Defense Forces',
        pictureName: 'zarya',
        abilities: [
            {
                ability: 'Particle Cannon',
                description: 'Zarya’s mighty Particle Cannon unleashes ' +
                'a short-range beam of destructive energy. Alternatively, ' +
                'Zarya can lob an explosive charge to strike multiple opponents.'
            },
            {
                ability: 'Particle Barrier',
                description: 'The Particle Cannon can emit a personal ' +
                'barrier that shields Zarya against incoming attacks, ' +
                'redirecting their energy to enhance her weapon’s damage ' +
                'and the width of its beam.'
            },
            {
                ability: 'Projected Barrier',
                description: 'Zarya surrounds one of her teammates with an ' +
                'energy barrier that simultaneously absorbs fire and ' +
                'boosts the power of her Particle Cannon.'
            },
            {
                ability: 'Graviton Surge',
                description: 'Zarya launches a gravity bomb that draws ' +
                'in enemy combatants and deals damage while they’re trapped.'
            }
        ]
    },

    {
        name: 'Zenyatta',
        role: 'Support',
        overview: 'Zenyatta calls upon orbs of harmony and discord to ' +
        'heal his teammates and weaken his opponents, all while pursuing ' +
        'a transcendent state of immunity to damage.',
        realName: 'Tekhartha Zenyatta',
        age: '20',
        occupation: 'Wandering Guru, Adventurer',
        baseOfOperations: 'Shambali Monastery, Nepal (formerly)',
        affiliation: 'The Shambali (formerly)',
        pictureName: 'zenyatta',
        abilities: [
            {
                ability: 'Orb of Destruction',
                description: 'Zenyatta projects his destructive energy ' +
                'orbs either individually, or in a rapid-fire volley after ' +
                'a few seconds spent gathering power.'
            },
            {
                ability: 'Orb of Harmony',
                description: 'Zenyatta casts an orb over the shoulder ' +
                'of a targeted ally. So long as Zenyatta maintains line ' +
                'of sight, the orb slowly restores health to his ally. ' +
                'Only one ally can receive the orb\'s benefit at a time.'
            },
            {
                ability: 'Orb of Discord',
                description: 'Attaching the orb of discord to an opponent ' +
                'amplifies the amount of damage they receive for as long ' +
                'as Zenyatta maintains line of sight. Only one opponent ' +
                'can suffer the orb\'s effects at a time.'
            },
            {
                ability: 'Transcendence',
                description: 'Zenyatta enters a state of heightened ' +
                'existence for a short period of time. While transcendent, ' +
                'Zenyatta cannot use abilities or weapons, but is immune ' +
                'to damage and automatically restores his health and that ' +
                'of nearby allies.'
            }
        ]
    }
];

// Bulk insert these documents into MongoDB
Hero
    .insertMany(heroDocuments)
    .then(heroDocs => {
        if (heroDocs > 0) {
            console.dir(`${heroDocs} have successfuly been added`);
        }
    })
    .catch(err => {
        console.error(err);
    });

*/