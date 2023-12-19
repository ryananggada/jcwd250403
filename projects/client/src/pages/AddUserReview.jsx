import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useToast,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  VisuallyHidden,
  Radio,
  Box,
  RadioGroup,
  Icon,
  Button,
} from '@chakra-ui/react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';
import UserLayout from '../components/UserLayout';

function CustomRadio({ children, ...props }) {
  return (
    <label>
      <VisuallyHidden>
        <Radio {...props} />
      </VisuallyHidden>
      <Box as="span">{children}</Box>
    </label>
  );
}

function AddUserReview() {
  const token = useSelector((state) => state.auth.token);

  const { id } = useParams();
  const navigate = useNavigate();

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleRatingChange = (value) => {
    formik.setFieldValue('rating', parseInt(value));
  };

  const handleSubmit = async (values, form) => {
    setIsLoading(true);

    try {
      await api.put(`/reviews/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Review is added.',
        isClosable: true,
        duration: 2500,
      });

      form.resetForm();
      navigate('/user/reviews');
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reviewSchema = Yup.object().shape({
    rating: Yup.number().min(1).max(5).required('Rating is required'),
    comment: Yup.string().required('Comment is required'),
  });

  const formik = useFormik({
    initialValues: {
      rating: 1,
      comment: '',
    },
    validationSchema: reviewSchema,
    onSubmit: handleSubmit,
  });

  return (
    <UserLayout>
      <Stack as="form" onSubmit={formik.handleSubmit}>
        <FormControl isInvalid={formik.errors.rating && formik.touched.rating}>
          <FormLabel>Rating</FormLabel>
          <RadioGroup
            defaultValue={formik.values.rating}
            onChange={handleRatingChange}
            isInline
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <CustomRadio key={value} value={value}>
                <Icon
                  as={value <= formik.values.rating ? FaStar : FaRegStar}
                  color="orange.300"
                  boxSize={16}
                />
              </CustomRadio>
            ))}
          </RadioGroup>
        </FormControl>

        <FormControl
          isInvalid={formik.errors.comment && formik.touched.comment}
        >
          <FormLabel>Comment</FormLabel>
          <Textarea
            name="comment"
            onChange={formik.handleChange}
            type="text"
            {...formik.getFieldProps('comment')}
          />
          <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          isDisabled={!(formik.isValid && formik.dirty)}
          colorScheme="green"
          isLoading={isLoading}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </Stack>
    </UserLayout>
  );
}

export default AddUserReview;
