export const deleteImage = async (imageId: string) => {
  // try {
    const response = await fetch(`/api/admin/gallery/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete image');
    }

    return await response.json();
  // } catch (error) {
  //   throw error;
  // }
};
