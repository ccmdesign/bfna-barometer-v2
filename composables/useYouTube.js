/**
 * Composable para manipulação de URLs do YouTube
 */
export const useYouTube = () => {
  /**
   * Converte uma URL do YouTube para o formato de embed
   * @param {string} url - URL do YouTube (ex: https://www.youtube.com/watch?v=HZixtkikyCY&feature=youtu.be)
   * @returns {string} URL formatada para embed (ex: https://www.youtube.com/embed/HZixtkikyCY)
   */
  const convertToEmbed = (url) => {
    if (!url) return null
    
    try {
      // Padrões comuns de URLs do YouTube
      const patterns = [
        // youtube.com/watch?v=VIDEO_ID
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        // youtube.com/v/VIDEO_ID
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
        // youtube.com/embed/VIDEO_ID
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
      ]
      
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
          const videoId = match[1]
          return `https://www.youtube.com/embed/${videoId}`
        }
      }
      
      // Se não encontrou nenhum padrão válido
      console.warn('URL do YouTube inválida:', url)
      return null
      
    } catch (error) {
      console.error('Erro ao converter URL do YouTube:', error)
      return null
    }
  }

  /**
   * Extrai o ID do vídeo de uma URL do YouTube
   * @param {string} url - URL do YouTube
   * @returns {string|null} ID do vídeo ou null se não encontrado
   */
  const extractVideoId = (url) => {
    if (!url) return null
    
    try {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
      ]
      
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
          return match[1]
        }
      }
      
      return null
      
    } catch (error) {
      console.error('Erro ao extrair ID do vídeo:', error)
      return null
    }
  }

  /**
   * Gera a URL da thumbnail do vídeo do YouTube
   * @param {string} url - URL do YouTube ou ID do vídeo
   * @param {string} quality - Qualidade da thumbnail ('default', 'hq', 'mq', 'sd', 'maxres')
   * @returns {string|null} URL da thumbnail ou null se não encontrado
   */
  const getThumbnail = (videoId, quality = 'hq') => {
    if (!videoId) return null
    
    const qualities = {
      default: 'default.jpg',
      hq: 'hqdefault.jpg',
      mq: 'mqdefault.jpg',
      sd: 'sddefault.jpg',
      maxres: 'maxresdefault.jpg'
    }
    
    const filename = qualities[quality] || qualities.hq
    return `https://img.youtube.com/vi/${videoId}/${filename}`
  }

  return {
    convertToEmbed,
    extractVideoId,
    getThumbnail
  }
}
