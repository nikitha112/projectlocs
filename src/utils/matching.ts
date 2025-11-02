import { Item } from '../types';

export function findPotentialMatches(newItem: Item, existingItems: Item[]): Item[] {
  const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
  const oppositeItems = existingItems.filter(item => 
    item.type === oppositeType && 
    item.status === 'active'
  );

  const matches = oppositeItems.filter(item => {
    // Check for similar titles (case insensitive, partial matches)
    const titleSimilarity = calculateTitleSimilarity(newItem.title, item.title);
    
    // Check for same category
    const sameCategory = newItem.category === item.category;
    
    // Check for location proximity (simple string matching for now)
    const locationSimilarity = calculateLocationSimilarity(newItem.location, item.location);
    
    // Consider it a match if title similarity > 0.3 OR (same category AND location similarity > 0.5)
    return titleSimilarity > 0.3 || (sameCategory && locationSimilarity > 0.5);
  });

  // Sort by relevance
  return matches.sort((a, b) => {
    const scoreA = calculateMatchScore(newItem, a);
    const scoreB = calculateMatchScore(newItem, b);
    return scoreB - scoreA;
  });
}

function calculateTitleSimilarity(title1: string, title2: string): number {
  const words1 = title1.toLowerCase().split(' ');
  const words2 = title2.toLowerCase().split(' ');
  
  let commonWords = 0;
  words1.forEach(word => {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      commonWords++;
    }
  });
  
  return commonWords / Math.max(words1.length, words2.length);
}

function calculateLocationSimilarity(loc1: string, loc2: string): number {
  const words1 = loc1.toLowerCase().split(' ');
  const words2 = loc2.toLowerCase().split(' ');
  
  let commonWords = 0;
  words1.forEach(word => {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      commonWords++;
    }
  });
  
  return commonWords / Math.max(words1.length, words2.length);
}

function calculateMatchScore(item1: Item, item2: Item): number {
  const titleScore = calculateTitleSimilarity(item1.title, item2.title) * 0.5;
  const categoryScore = (item1.category === item2.category) ? 0.3 : 0;
  const locationScore = calculateLocationSimilarity(item1.location, item2.location) * 0.2;
  
  return titleScore + categoryScore + locationScore;
}