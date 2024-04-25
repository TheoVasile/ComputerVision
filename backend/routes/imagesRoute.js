import express from 'express';
import { Img } from '../models/imageModel.js';

const router = express.Router();

router.post(`/`, async (request, response) => {
    try {
        if (!request.body.img) {
            return response.status(400).send({message: 'Send all required fields: img'});
        }
        const newImg = {
            img: request.body.img
        };

        const img = await Img.create(newImg);

        return response.status(201).send(img);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})


router.get('/', async (request, response) => {
    try {
        const images = await Img.find({});

        return response.status(200).json({
            count: images.length,
            data: images
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const image = await Img.findById(id);

        return response.status(200).json(image);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.put('/:id', async (request, response) => {
    try {
        if (!request.body.img) {
            return response.status(400).send({message: 'Send all required fields: img'});
        }

        const { id } = request.params;

        const result = await Img.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({message: 'Image not found'});
        }
        return response.status(200).send({message: "Image updated succesfully"});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Img.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({message: 'Image not found'});
        }
        return response.status(200).send({message: "Image deleted succesfully"});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

export default router;