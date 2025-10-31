import React from 'react'

export interface HtmlNode {
  tag?: string
  attributes?: { [key: string]: string }
  children?: (HtmlNode | string)[]
  text?: string
}

interface HtmlLikeProps {
  root: HtmlNode | HtmlNode[]
  as?: React.ElementType
  className?: string
}

const renderNode = (
  node: HtmlNode | string,
  index: number,
): React.ReactNode => {
  if (typeof node === 'string') {
    return node
  }
  if (node.text !== undefined) {
    return node.text
  }

  const { tag = 'div', attributes = {}, children } = node
  const Tag = tag as React.ElementType

  const props: { [key: string]: any } = {}
  for (const key in attributes) {
    if (key === 'class') {
      props.className = attributes[key]
    } else {
      props[key] = attributes[key]
    }
  }

  return (
    <Tag key={index} {...props}>
      {children?.map((child, i) => renderNode(child, i))}
    </Tag>
  )
}

const HtmlLike: React.FC<HtmlLikeProps> = ({ root, as, className }) => {
  const RootComponent = as || React.Fragment
  const rootProps = as ? { className } : {}

  // Handle array of nodes
  if (Array.isArray(root)) {
    return (
      <RootComponent {...rootProps}>
        {root.map((node, index) => renderNode(node, index))}
      </RootComponent>
    )
  }

  // Handle single node
  return <RootComponent {...rootProps}>{renderNode(root, 0)}</RootComponent>
}

export default HtmlLike
