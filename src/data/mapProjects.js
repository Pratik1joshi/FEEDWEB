// Map Projects Data - Minimal structure for map visualization only
// Just the essentials: title, description, location, coordinates, status, category
import { projects } from './projects'

// Transform original projects data to minimal map-friendly structure
export const mapProjects = projects.map(project => ({
  id: project.id,
  slug: project.slug,
  title: project.title,
  description: project.description || project.excerpt || 'Project description not available',
  location: project.location,
  coordinates: {
    lat: project.coordinates ? project.coordinates[0] : 27.7172, // Default to Kathmandu if no coordinates
    lng: project.coordinates ? project.coordinates[1] : 85.3240
  },
  status: project.status || 'Completed',
  category: project.category || 'Development',
  type: 'map'
}))
