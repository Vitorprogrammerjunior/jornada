const express = require('express');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const {
  s3Client, BUCKET, REGION, BASE_FOLDER, createSubFolder
} = require('backend/storage');
const auth = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();
const upload = multer();

router.post(
  '/phases/:phaseId/documents',
  auth('leader'),
  upload.single('document'),
  async (req, res) => {
    try {
      const { phaseId } = req.params;
      const file = req.file;
      if (!file) return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });

      // 1) Cria/garante a subpasta UNIVC/phaseId/
      await createSubFolder(phaseId);

      // 2) Monta o key e envia o arquivo
      const key = `${BASE_FOLDER}/${phaseId}/${uuidv4()}_${file.originalname}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
      }));

      const fileUrl = `https://${BUCKET}.${REGION}.digitaloceanspaces.com/${key}`;

      // 3) Persiste no banco (já guardando também group_id etc.)
      await pool.query(
        `INSERT INTO documents (id, phase_id, leader_id, group_id, file_name, file_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), phaseId, req.user.id, req.user.group_id, file.originalname, fileUrl]
      );

      res.json({ success: true, fileUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erro ao enviar documento' });
    }
  }
);

module.exports = router;
