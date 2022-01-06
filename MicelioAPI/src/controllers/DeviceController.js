const knex = require('../database/connection');
const yup = require('yup');

class DeviceController {

	async create(request, response) {

		const { device_id, system_name, model, screen_width, screen_height } = request.body;

		//TODO: validação
		if (!device_id) {
			return response.status(400).json({ error: "Invalid device id" });
		}

		if (!system_name) {
			return response.status(400).json({ error: "Invalid system information" });
		}

		if (!model) {
			return response.status(400).json({ error: "Invalid device model" });
		}

		if (!screen_width) {
			return response.status(400).json({ error: "Invalid screen width" });
		}

		if (!screen_height) {
			return response.status(400).json({ error: "Invalid screen height" });
		}

		if(request.url === '/test'){
			return response.status(202).json({ok: true});
		}

		//transação
		try {

			const data = {
				device_id,
				system_name,
				model,
				screen_width,
				screen_height
			}

			const registeredDevice = await knex('Device')
				.select('device_id')
				.where('device_id', device_id)
				.first();

			if (registeredDevice) {
				return response.status(200).json({ ok: true });
			}

			const device = await knex('Device').insert(data);

			if (device) {
				return response.status(201).json({ ok: true });
			}

			return response.status(400).json({ error: 'Cannot insert this device, try again later' });

		} catch (err) {
			return response.status(400).json({ error: err });
		}

	}

	async validate(){
		//{ device_id, system_name, model, screen_width, screen_height }

		let schema= yup.object().shape({
			device_id: yup.string().required(),
			system_name: yup.string().required(),
			model: yup.string().required(),
			screen_width: yup.string().required(),
			screen_height: yup.string().required()
		});

		schema.isValid(device).catch(
			function (err){
				console.log(err);
			}
		).then(() => device)
	}

}

module.exports = DeviceController;
