export interface Profile {
  id: string
  user_id: string
  name: string
  whatsapp: string | null
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  user_id: string
  name: string
  species: string
  breed: string | null
  sex: 'macho' | 'femea' | 'nao_informado' | null
  birth_date: string | null
  color: string | null
  characteristics: string | null
  important_information: string | null
  photo_url: string | null
  is_lost: boolean
  created_at: string
  updated_at: string
}

export type PetFormData = Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>
