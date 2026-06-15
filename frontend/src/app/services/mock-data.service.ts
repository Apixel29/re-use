import { Injectable, signal, computed } from '@angular/core';

export interface Specification {
  key: string;
  value: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  sellerName: string;
  sellerEmail: string;
  sellerReputation: number;
  acquisitionType: 'Venta' | 'Donación' | 'Intercambio';
  price: number;
  stock: number;
  category: string;
  state: 'Nuevo' | 'Casi Nuevo' | 'Usado';
  images: string[]; // SVGs or URLs
  specifications: Specification[];
}

export interface Message {
  sender: 'me' | 'partner';
  text: string;
  time: string;
  fileType?: 'image' | 'pdf';
  fileUrl?: string; // base64 representation
  fileName?: string;
}

export interface Chat {
  id: string;
  articleId: string;
  articleTitle: string;
  partnerName: string;
  partnerRole: 'Vendedor' | 'Cliente';
  messages: Message[];
}

export interface UserProfile {
  name: string;
  email: string;
  boleta: string;
  phone: string;
  reputation: number;
  avatarUrl?: string; // base64 representation
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Current user state (logged in user details)
  currentUser = signal<UserProfile | null>({
    name: 'Juan Pérez López',
    email: 'jperezl@alumno.ipn.mx',
    boleta: '2020081399',
    phone: '5544332211',
    reputation: 4.5
  });

  // Global search query for sharing between header and components
  searchQuery = signal<string>('');

  // Master list of electronic components (publications)
  publications = signal<Article[]>([
    {
      id: '1',
      title: 'Sensor Ultrasónico HC-SR04',
      description: 'Sensor de distancia ultrasónico para proyectos de robótica y automatización con Arduino, PIC o Raspberry Pi. Rango de medición de 2cm a 400cm con precisión de 3mm.',
      sellerName: 'Sofía Rodríguez García',
      sellerEmail: 'srodriguezg@alumno.ipn.mx',
      sellerReputation: 4.5,
      acquisitionType: 'Venta',
      price: 50.00,
      stock: 5,
      category: 'Módulos y Sensores',
      state: 'Nuevo',
      images: ['sensor_ultrasonico_hc_sr04'],
      specifications: [
        { key: 'Voltaje de operación', value: '5V DC' },
        { key: 'Frecuencia de trabajo', value: '40 kHz' },
        { key: 'Ángulo de medición', value: '15 grados' }
      ]
    },
    {
      id: '2',
      title: 'Placa de desarrollo Arduino Uno R3',
      description: 'Placa de desarrollo Arduino Uno original, en excelente estado. Incluye cable USB de conexión. Ideal para aprender microcontroladores y electrónica básica.',
      sellerName: 'Carlos Mendoza Ruiz',
      sellerEmail: 'cmendozar@alumno.ipn.mx',
      sellerReputation: 4.0,
      acquisitionType: 'Donación',
      price: 0,
      stock: 1,
      category: 'Tarjetas de desarrollo',
      state: 'Casi Nuevo',
      images: ['arduino_uno'],
      specifications: [
        { key: 'Microcontrolador', value: 'ATmega328P' },
        { key: 'Voltaje recomendado', value: '7-12V' },
        { key: 'Pines E/S Digitales', value: '14 (6 con PWM)' }
      ]
    },
    {
      id: '3',
      title: 'Compuerta Lógica AND 74LS08',
      description: 'Circuito integrado TTL 74LS08 que contiene cuatro compuertas AND de dos entradas. Totalmente nuevo, patitas sin doblar, listo para protoboard.',
      sellerName: 'Luis Ángel Torres',
      sellerEmail: 'ltorres@alumno.ipn.mx',
      sellerReputation: 5.0,
      acquisitionType: 'Intercambio',
      price: 15.00,
      stock: 10,
      category: 'Semiconductores',
      state: 'Nuevo',
      images: ['compuerta_74ls08'],
      specifications: [
        { key: 'Familia lógica', value: 'LS-TTL' },
        { key: 'Voltaje de alimentación', value: '4.75V - 5.25V' },
        { key: 'Encapsulado', value: 'DIP-14' }
      ]
    },
    {
      id: '4',
      title: 'Cable UTP Categoría 6 - 5 metros',
      description: 'Tramo de cable de red ponchado UTP Categoría 6, color azul. Con conectores RJ45 y botas protectoras en los extremos. Excelente transferencia de datos.',
      sellerName: 'Sofía Rodríguez García',
      sellerEmail: 'srodriguezg@alumno.ipn.mx',
      sellerReputation: 4.5,
      acquisitionType: 'Venta',
      price: 60.00,
      stock: 2,
      category: 'Kits Completos',
      state: 'Nuevo',
      images: ['cable_utp_cat6'],
      specifications: [
        { key: 'Longitud', value: '5 metros' },
        { key: 'Categoría', value: 'Cat 6' },
        { key: 'Blindaje', value: 'U/UTP' }
      ]
    },
    {
      id: '5',
      title: 'Kit de Resistencias de Carbón',
      description: 'Bolsa con surtido de 100 resistencias de carbón a 1/4W con toleracia del 5%. Valores comunes de 220, 330, 1k, 10k y 100k ohms (20 piezas de cada valor).',
      sellerName: 'Ricardo Gómez Silva',
      sellerEmail: 'rgomezs@alumno.ipn.mx',
      sellerReputation: 3.5,
      acquisitionType: 'Venta',
      price: 35.00,
      stock: 3,
      category: 'Pasivos',
      state: 'Nuevo',
      images: ['kit_resistencias'],
      specifications: [
        { key: 'Potencia', value: '0.25 W (1/4W)' },
        { key: 'Tolerancia', value: '5%' },
        { key: 'Tipo', value: 'Pelicula de carbón' }
      ]
    },
    {
      id: '6',
      title: 'Sensor de Temperatura LM35',
      description: 'Sensor analógico de precisión de temperatura en encapsulado TO-92. Calibrado directamente en grados Celsius. Salida lineal de 10mV/°C.',
      sellerName: 'Carlos Mendoza Ruiz',
      sellerEmail: 'cmendozar@alumno.ipn.mx',
      sellerReputation: 4.0,
      acquisitionType: 'Venta',
      price: 25.00,
      stock: 4,
      category: 'Módulos y Sensores',
      state: 'Nuevo',
      images: ['sensor_lm35'],
      specifications: [
        { key: 'Rango de medición', value: '-55°C a 150°C' },
        { key: 'Precisión garantizada', value: '0.5°C a temperatura ambiente' },
        { key: 'Voltaje de alimentación', value: '4V a 30V' }
      ]
    }
  ]);

  // Saved publications (bookmarks) - stores Article IDs
  savedIds = signal<Set<string>>(new Set(['1', '4']));

  // Chat conversations
  chats = signal<Chat[]>([
    {
      id: 'chat_1',
      articleId: '1',
      articleTitle: 'Sensor Ultrasónico HC-SR04',
      partnerName: 'Sofía Rodríguez García',
      partnerRole: 'Vendedor',
      messages: [
        { sender: 'partner', text: 'Hola, buenas tardes. ¿Te interesa el sensor ultrasónico?', time: '14:30' },
        { sender: 'me', text: 'Hola, sí. ¿Dónde nos podríamos ver para la entrega?', time: '14:32' },
        { sender: 'partner', text: 'Puedo en los laboratorios de computación de ESCOM a las 2:00 pm mañana.', time: '14:35' },
        { sender: 'me', text: 'Me parece excelente, nos vemos ahí.', time: '14:37' }
      ]
    },
    {
      id: 'chat_2',
      articleId: '2',
      articleTitle: 'Placa de desarrollo Arduino Uno R3',
      partnerName: 'Carlos Mendoza Ruiz',
      partnerRole: 'Vendedor',
      messages: [
        { sender: 'me', text: 'Hola Carlos, me interesa la placa Arduino que estás donando.', time: '10:15' },
        { sender: 'partner', text: 'Hola, ¡claro! Aún la tengo disponible. Es para un proyecto de clase?', time: '10:20' }
      ]
    },
    {
      id: 'chat_3',
      articleId: '5',
      articleTitle: 'Kit de Resistencias de Carbón',
      partnerName: 'Alberto Sánchez Diaz',
      partnerRole: 'Cliente',
      messages: [
        { sender: 'partner', text: 'Hola, ¿aún tienes el kit de resistencias?', time: '09:00' },
        { sender: 'me', text: 'Hola, sí, aún me quedan 3 kits disponibles.', time: '09:05' },
        { sender: 'partner', text: 'Te compro 2 por favor. ¿Puedes hoy en el edificio de gobierno?', time: '09:12' }
      ]
    }
  ]);

  // Helper getters
  savedPublications = computed(() => {
    const ids = this.savedIds();
    return this.publications().filter(p => ids.has(p.id));
  });

  // Actions
  toggleSave(articleId: string) {
    const current = new Set(this.savedIds());
    if (current.has(articleId)) {
      current.delete(articleId);
    } else {
      current.add(articleId);
    }
    this.savedIds.set(current);
  }

  isSaved(articleId: string): boolean {
    return this.savedIds().has(articleId);
  }

  addPublication(article: Omit<Article, 'id' | 'sellerName' | 'sellerEmail' | 'sellerReputation' | 'images'> & { images?: string[] }) {
    const user = this.currentUser();
    if (!user) return;

    const newArticle: Article = {
      ...article,
      id: (this.publications().length + 1).toString(),
      sellerName: user.name,
      sellerEmail: user.email,
      sellerReputation: user.reputation,
      images: article.images && article.images.length > 0 ? article.images : ['generic_hardware']
    };

    this.publications.set([newArticle, ...this.publications()]);
  }

  updatePublication(articleId: string, updatedFields: Partial<Article>) {
    this.publications.set(
      this.publications().map(p => {
        if (p.id === articleId) {
          return { ...p, ...updatedFields } as Article;
        }
        return p;
      })
    );
  }

  updateUserProfile(profile: Partial<UserProfile>) {
    const current = this.currentUser();
    if (current) {
      this.currentUser.set({ ...current, ...profile });
    }
  }

  sendMessage(chatId: string, text: string, fileType?: 'image' | 'pdf', fileUrl?: string, fileName?: string) {
    this.chats.set(
      this.chats().map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              { 
                sender: 'me', 
                text, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fileType,
                fileUrl,
                fileName
              }
            ]
          };
        }
        return c;
      })
    );
  }

  startChat(articleId: string): string {
    const article = this.publications().find(p => p.id === articleId);
    if (!article) return '';

    // Check if chat already exists
    const existingChat = this.chats().find(c => c.articleId === articleId && c.partnerName === article.sellerName);
    if (existingChat) return existingChat.id;

    // Create new chat
    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      articleId: article.id,
      articleTitle: article.title,
      partnerName: article.sellerName,
      partnerRole: 'Vendedor',
      messages: []
    };

    this.chats.set([newChat, ...this.chats()]);
    return newChatId;
  }
}
