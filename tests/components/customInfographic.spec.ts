// @vitest-environment happy-dom
// Component test for customInfographic.vue.
//
// We intentionally avoid `@nuxt/test-utils`' `mountSuspended` (which boots a
// full Nuxt runtime — overkill, and currently fails in this repo because
// `app.head.link` preloads `/assets/barometer-logo.svg` through a virtual id
// Vite refuses to serve under the test runner). Plain `@vue/test-utils` with
// stubs for the Nuxt-injected components (`NuxtLink`, `bar-button`) is enough
// to assert the v-if/v-else mimetype-guard branch.
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomInfographic from '../../components/customInfographic.vue'

const stubs = {
  NuxtLink: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  },
  // `bar-button` is auto-imported in dev; render it as a no-op span so the
  // branch we actually care about (img vs empty-state) is what's asserted.
  'bar-button': {
    name: 'BarButton',
    props: ['to', 'visual', 'size', 'color', 'target'],
    template: '<a class="bar-button" :href="to"><slot /></a>'
  }
}

const baseData = {
  title: 'Balance of Trade with U.S. (Goods and Services)',
  infographicDescription: 'Imports vs. exports over the last decade.'
}

describe('CustomInfographic.vue', () => {
  it('renders an <img> when customInfographicFile.url is non-empty', () => {
    const wrapper = mount(CustomInfographic, {
      global: { stubs },
      props: {
        data: {
          ...baseData,
          customInfographicFile: {
            url: 'https://images.ctfassets.net/x/y/balance.png?w=2000&fm=webp&q=80&fit=fill',
            title: 'Balance'
          }
        }
      }
    })

    const img = wrapper.find('img.custom_infographic-card__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('balance.png')
    expect(wrapper.find('.empty-state').exists()).toBe(false)
    expect(wrapper.text()).toContain(baseData.title)
  })

  it('renders empty-state fallback (no <img>, no <a>) when url is empty', () => {
    const wrapper = mount(CustomInfographic, {
      global: { stubs },
      props: {
        data: {
          ...baseData,
          customInfographicFile: { url: '', title: '' }
        }
      }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
    expect(emptyState.text()).toBe('No image available for this infographic.')
    // Title and description still render so the card isn't completely blank.
    expect(wrapper.text()).toContain(baseData.title)
    expect(wrapper.text()).toContain(baseData.infographicDescription)
  })

  it('renders empty-state fallback when customInfographicFile itself is missing', () => {
    const wrapper = mount(CustomInfographic, {
      global: { stubs },
      props: {
        data: { ...baseData }
      }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })
})
