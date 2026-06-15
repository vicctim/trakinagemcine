import React from 'react'
import Link from 'next/link'

function renderText(node: any, key: number) {
  let text: React.ReactNode = node.text

  // Lexical format bitmask: 1 bold, 2 italic, 8 underline, 16 code
  if (node.format & 16) text = <code key={key}>{text}</code>
  if (node.format & 8) text = <u>{text}</u>
  if (node.format & 2) text = <em>{text}</em>
  if (node.format & 1) text = <strong>{text}</strong>

  return <React.Fragment key={key}>{text}</React.Fragment>
}

function renderNode(node: any, key: number): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'text':
      return renderText(node, key)

    case 'linebreak':
      return <br key={key} />

    case 'paragraph':
      return (
        <p key={key}>
          {(node.children || []).map((child: any, i: number) => renderNode(child, i))}
        </p>
      )

    case 'heading': {
      const Tag = (node.tag || 'h2') as React.ElementType
      return (
        <Tag key={key}>
          {(node.children || []).map((child: any, i: number) => renderNode(child, i))}
        </Tag>
      )
    }

    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <ListTag key={key}>
          {(node.children || []).map((child: any, i: number) => renderNode(child, i))}
        </ListTag>
      )
    }

    case 'listitem':
      return (
        <li key={key}>
          {(node.children || []).map((child: any, i: number) => renderNode(child, i))}
        </li>
      )

    case 'link': {
      const url = node.fields?.url || '#'
      const children = (node.children || []).map((child: any, i: number) => renderNode(child, i))

      if (node.fields?.newTab || /^https?:\/\//.test(url)) {
        return (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      }

      return (
        <Link key={key} href={url}>
          {children}
        </Link>
      )
    }

    default:
      if (node.children) {
        return (
          <React.Fragment key={key}>
            {node.children.map((child: any, i: number) => renderNode(child, i))}
          </React.Fragment>
        )
      }
      return null
  }
}

export function LexicalContent({ content }: { content: any }) {
  const root = content?.root

  if (!root?.children) return null

  return (
    <div className="lexical-content">
      {root.children.map((node: any, i: number) => renderNode(node, i))}
    </div>
  )
}
