import type { PageServerLoad, Actions } from './$types';
import {v2 as cloudinary} from 'cloudinary';
import { VITE_PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/private';
import { db } from '$lib/server';
import { imagesTable } from '$lib/server/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export const load: PageServerLoad = async () => {
    cloudinary.config({ 
    cloud_name: "dszfasa7p", 
    api_key: '789787526647423', 
    api_secret: '4bkF-QbF9ehOogKHSE2NGbO-Xe8' 
    });

    const imagesData = await db.query.imagesTable.findFirst();

    return {
      form: await superValidate(imagesData, zod(formSchema))
    };

};

export const actions: Actions = {
    default: async (event) => {
      const form = await superValidate(event, zod(formSchema));
      if (!form.valid) {
        return fail(400, {
          form
        });
      }
  
      if (!form.data.id) {
        form.data.id = generateId(15);
      }
  
      await db
        .insert(imagesTable)
        .values({
          id: form.data.id,
          link: form.data.link
        })
        .onConflictDoUpdate({
          target: imagesTable.id,
          set: {
            link: form.data.link,
          }
        });
  
      return {
        form
      };
    }
  };
