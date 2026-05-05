import type { GlobalConfig } from 'payload'

export const BackupConfig: GlobalConfig = {
  slug: 'backup-config',
  label: 'Backups',
  admin: {
    group: 'Sistema',
    description:
      '🛡️ Configurações de backup automático (banco de dados + mídias). Os backups são salvos localmente e enviados para o Google Drive via rclone.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Retenção',
          description: 'Quantos backups manter de cada tipo. Os mais antigos são removidos automaticamente.',
          fields: [
            {
              name: 'retentionDaily',
              label: 'Manter backups diários (dias)',
              type: 'number',
              defaultValue: 7,
              min: 1,
              max: 90,
              admin: {
                description:
                  'Quantos backups diários mais recentes serão mantidos. Padrão: 7 dias.',
              },
            },
            {
              name: 'retentionWeekly',
              label: 'Manter backups semanais',
              type: 'number',
              defaultValue: 4,
              min: 0,
              max: 52,
              admin: {
                description: 'Quantos backups semanais (1 por semana). Padrão: 4 semanas.',
              },
            },
            {
              name: 'retentionMonthly',
              label: 'Manter backups mensais',
              type: 'number',
              defaultValue: 6,
              min: 0,
              max: 36,
              admin: {
                description: 'Quantos backups mensais (1 por mês). Padrão: 6 meses.',
              },
            },
          ],
        },
        {
          label: 'Google Drive',
          description: 'Envio automático dos backups para o Google Drive via rclone. Requer rclone configurado na VPS.',
          fields: [
            {
              name: 'driveEnabled',
              label: 'Enviar para Google Drive',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Quando ativo, cada backup é copiado para o Google Drive. Veja "Comandos de Setup" no Dashboard.',
              },
            },
            {
              name: 'driveRemoteName',
              label: 'Nome do remote (rclone)',
              type: 'text',
              defaultValue: 'gdrive-trakinagem',
              admin: {
                description:
                  'Nome do remote configurado no rclone. Use o mesmo definido em `rclone config` na VPS.',
              },
            },
            {
              name: 'driveFolder',
              label: 'Pasta no Google Drive',
              type: 'text',
              defaultValue: 'backups/trakinagemcine',
              admin: {
                description:
                  'Caminho dentro do Drive onde os backups são salvos. Será criado automaticamente.',
              },
            },
          ],
        },
        {
          label: 'Agendamento',
          description: 'Horário em que o backup roda automaticamente (apenas referência — configurado no crontab da VPS).',
          fields: [
            {
              name: 'cronSchedule',
              label: 'Horário programado (cron)',
              type: 'text',
              defaultValue: '0 3 * * *',
              admin: {
                description:
                  'Formato cron. Padrão: 0 3 * * * = todo dia às 3h da manhã. Editar aqui é apenas referência — a configuração real é no crontab da VPS.',
              },
            },
          ],
        },
        {
          label: 'Status',
          description: 'Atualizado automaticamente pelo script de backup. Apenas leitura.',
          fields: [
            {
              name: 'lastBackupAt',
              label: 'Última execução',
              type: 'date',
              admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'lastBackupSize',
              label: 'Tamanho (bytes)',
              type: 'number',
              admin: { readOnly: true },
            },
            {
              name: 'lastBackupStatus',
              label: 'Status',
              type: 'select',
              options: [
                { label: '✅ Sucesso', value: 'success' },
                { label: '❌ Falha', value: 'error' },
                { label: '⏳ Em execução', value: 'running' },
              ],
              admin: { readOnly: true },
            },
            {
              name: 'lastBackupMessage',
              label: 'Mensagem',
              type: 'textarea',
              admin: { readOnly: true },
            },
          ],
        },
      ],
    },
  ],
}
