import React from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Trakinagem Cine',
  description: 'Política de Privacidade e proteção de dados pessoais (LGPD) do Trakinagem Cine.',
}

export default function PrivacidadePage() {
  return (
    <main className="page-editorial">
      <section className="section page-header-section">
        <div className="container container--narrow">
          <SectionHeader label="LGPD" title="Política de Privacidade" />
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow editorial-content">
          <p>
            <strong>Última atualização:</strong> Abril de 2026
          </p>

          <h2>1. Coleta de Dados</h2>
          <p>
            O Trakinagem Cine coleta dados pessoais exclusivamente através do formulário de contato
            (nome, e-mail, telefone e mensagem), quando fornecidos voluntariamente pelo usuário.
          </p>

          <h2>2. Finalidade</h2>
          <p>
            Os dados coletados são utilizados exclusivamente para responder às solicitações
            recebidas e manter comunicação sobre o projeto. Não compartilhamos dados com terceiros.
          </p>

          <h2>3. Cookies</h2>
          <p>
            Este site utiliza apenas cookies estritamente necessários para seu funcionamento. Não
            utilizamos cookies de rastreamento, analytics ou publicidade sem consentimento prévio.
          </p>

          <h2>4. Armazenamento</h2>
          <p>
            Os dados são armazenados em servidores seguros e protegidos por criptografia. O acesso
            é restrito aos administradores do projeto.
          </p>

          <h2>5. Direitos do Titular</h2>
          <p>
            Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
          </p>
          <ul>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou incorretos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar o consentimento</li>
          </ul>

          <h2>6. Contato</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato
            através da página{' '}
            <a href="/vamos-juntos" style={{ color: 'var(--color-accent)' }}>
              Vamos Juntos?
            </a>
          </p>
        </div>
      </section>

      <style>{`
        .page-header-section { padding-top: 120px; }
        .container--narrow { max-width: 780px; }

        .editorial-content h2 {
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          font-size: 1.15rem;
          color: var(--color-accent);
        }

        .editorial-content p {
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .editorial-content ul {
          margin-top: 0.5rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .editorial-content li {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--color-text-secondary);
        }
      `}</style>
    </main>
  )
}
