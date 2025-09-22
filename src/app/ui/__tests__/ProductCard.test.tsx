import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { ProductField } from '@/app/lib/definitions';

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, ...props }: any) => (
        <img src={src} alt={alt} {...props} />
    ),
}));

// Mock cart functionality
jest.mock('@/app/lib/cart', () => ({
    addToCart: jest.fn(),
}));

const mockProduct: ProductField = {
    id: '1',
    name: 'Test Wig',
    description: 'A beautiful test wig for testing purposes',
    price: 99.99,
    category: 'Straight',
    image_url: '/test-image.jpg',
    average_rating: 4.5,
};

describe('ProductCard', () => {
    it('renders product information correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Wig')).toBeInTheDocument();
        expect(screen.getByText('A beautiful test wig for testing purposes')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('Straight')).toBeInTheDocument();
        expect(screen.getByText('(4.5)')).toBeInTheDocument();
    });

    it('renders star rating correctly', () => {
        render(<ProductCard product={mockProduct} />);

        // Should have 4 full stars and 1 half star for 4.5 rating
        const stars = screen.getAllByRole('img', { hidden: true });
        expect(stars).toHaveLength(1); // The main product image
    });

    it('handles click events', () => {
        const mockOnClick = jest.fn();
        render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

        const productName = screen.getByText('Test Wig');
        fireEvent.click(productName);

        expect(mockOnClick).toHaveBeenCalledWith('1');
    });

    it('handles add to cart', () => {
        const { addToCart } = require('@/app/lib/cart');
        render(<ProductCard product={mockProduct} />);

        const addToCartButton = screen.getByText('Add to Cart');
        fireEvent.click(addToCartButton);

        expect(addToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('conditionally shows category and rating', () => {
        render(
            <ProductCard
                product={mockProduct}
                showCategory={false}
                showRating={false}
            />
        );

        expect(screen.queryByText('Straight')).not.toBeInTheDocument();
        expect(screen.queryByText('(4.5)')).not.toBeInTheDocument();
    });

    it('handles products without rating', () => {
        const productWithoutRating = { ...mockProduct, average_rating: null };
        render(<ProductCard product={productWithoutRating} />);

        expect(screen.getByText('No rating')).toBeInTheDocument();
    });

    it('handles products without image', () => {
        const productWithoutImage = { ...mockProduct, image_url: undefined };
        render(<ProductCard product={productWithoutImage} />);

        expect(screen.getByText('No Image')).toBeInTheDocument();
    });
});