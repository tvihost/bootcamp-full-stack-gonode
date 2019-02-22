const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class AppointmentsController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)

    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date: moment(date).tz('America/Fortaleza')
    })

    return res.redirect('/app/dashboard')
  }

  async appointmentsProvider (req, res) {
    const findAppointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            moment()
              // .add(1, 'days')
              .startOf('day')
              .format(),
            moment()
              // .add(1, 'days')
              .endOf('day')
              .format()
          ]
        }
      }
    })

    const appointments = findAppointments.map(item => {
      item.hour = moment(item.date).format('HH:mm')

      return item
    })

    return res.render('appointments/appointments', { appointments })
  }
}

module.exports = new AppointmentsController()
