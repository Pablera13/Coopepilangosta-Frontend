
import api from "../Api/apiAxios";

export const getReviewById = async(productid,state) => { 
    let data = await api.get(`Review?productid=${productid}`).then(result => result.data);
    state(data)
    return data;
}

export const getStarsAverage = async (productid, state) => { 
    let data = await api.get(`review/Average?productid=${productid}`);
    let average = data.data
    state(average)
    return average;
};

export const createReview = async (review) => { 
    let data = await api.post('review',review).then(result => result.data);
    return data;
};

export const deleteReview = async (id) => { 
    let data = await api.delete(`review/${id}`);
    return data;
};

export const ReviewUpdate = async (review) => { 
    console.log(review)
    
    let reviewEdit = {
        description: review.description,
        stars: review.stars,
        productId: review.productId,
        costumerId: review.costumerId,
        reviewDate: review.reviewDate,
    }

    let data = await api.put(`review/${review.id}`,reviewEdit).then(result => result.data);
    return data;
};