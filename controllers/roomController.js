const pool = require("../config/db");

exports.getRooms = async (req, res) => {

    try {

        const [rooms] = await pool.query(`
            SELECT * FROM rooms
        `);

        res.json(rooms);

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.createRoom = async (req, res) => {

    const {
        room_number,
        floor,
        area,
        price,
        deposit,
        description
    } = req.body;

    const owner_id = req.user.id;

    try {

        const [result] = await pool.query(`
            INSERT INTO rooms
            (owner_id, room_number, floor, area, price, deposit, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [owner_id, room_number, floor, area, price, deposit, description]
        );

        res.json({
            message: "Room created",
            roomId: result.insertId
        });

    } catch (err) {
        res.status(500).json(err);
    }
};