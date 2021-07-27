const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/users');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

/* const user = new User({email:'admin@a.a', username:'admin'})
    const registerUser = User.register(user, 'admin') */

const sample = array => array[Math.floor(Math.random() * array.length)];
const userid = User.find(  async(err,users) => {
    console.log(users.length)
    
    const seedDB = async () => {
        await Campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const sampleUser = users[Math.floor(Math.random() * users.length)];
            const camp = new Campground({
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                images: 
                    [
                        {url: 'https://source.unsplash.com/collection/483251',
                        filename: '123456789'},
                        {url: 'https://source.unsplash.com/collection/483251',
                        filename: '123456789'}
                    ],
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit nisi qui laboriosam. Saepe consequuntur quod esse dolor soluta amet repellendus eos sunt atque alias, vitae itaque incidunt a optio veniam?',
                author: sampleUser._id,
                price: Math.floor(Math.random() * 20 ) + 10,
                geometry: {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
                }
            })
            console.log(sampleUser)
            await camp.save();
        }
    }
    
    seedDB().then(() => {
        mongoose.connection.close();
    }) 



}) 



/* const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: 
                [
                    {url: 'https://source.unsplash.com/collection/483251',
                    filename: '123456789'},
                    {url: 'https://source.unsplash.com/collection/483251',
                    filename: '123456789'}
                ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit nisi qui laboriosam. Saepe consequuntur quod esse dolor soluta amet repellendus eos sunt atque alias, vitae itaque incidunt a optio veniam?',
            author: '60e5aef24492753fecb1141d',
            price: Math.floor(Math.random() * 20 ) + 10
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
}) */