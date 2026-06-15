import type { Block } from 'payload'
import { HeroSectionBlock } from './HeroSectionBlock'
import { RichTextBlock } from './RichTextBlock'
import { CardsGridBlock } from './CardsGridBlock'
import { GalleryBlock } from './GalleryBlock'
import { VideoBlock } from './VideoBlock'
import { CountersBlock } from './CountersBlock'
import { LogosBlock } from './LogosBlock'
import { CallToActionBlock } from './CallToActionBlock'

export const pageBlocks: Block[] = [
  HeroSectionBlock,
  RichTextBlock,
  CardsGridBlock,
  GalleryBlock,
  VideoBlock,
  CountersBlock,
  LogosBlock,
  CallToActionBlock,
]

export {
  HeroSectionBlock,
  RichTextBlock,
  CardsGridBlock,
  GalleryBlock,
  VideoBlock,
  CountersBlock,
  LogosBlock,
  CallToActionBlock,
}
