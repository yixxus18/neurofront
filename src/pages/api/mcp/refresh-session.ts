import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { chat_id, user_jwt, ttl_sec = 900 } = req.body;

    if (!chat_id || !user_jwt) {
      return res.status(400).json({
        success: false,
        message: 'chat_id y user_jwt son obligatorios'
      });
    }

    const mcpUrl = process.env.MCP_URL;
    const mcpAppToken = process.env.MCP_APP_TOKEN;

    if (!mcpUrl || !mcpAppToken) {
      console.error('MCP_URL or MCP_APP_TOKEN not configured');
      return res.status(500).json({
        success: false,
        message: 'Configuración del servidor incompleta'
      });
    }

    const response = await axios.post(`${mcpUrl}/mcp/session/refresh`, {
      chat_id,
      user_jwt,
      ttl_sec
    }, {
      headers: {
        'Authorization': `Bearer ${mcpAppToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error refreshing MCP session:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Error al refrescar sesión MCP'
    });
  }
}