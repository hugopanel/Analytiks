"use client"

import { Radio, RadioGroup } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

import Image from "next/image";
import Link from 'next/link';
import { Router } from 'lucide-react';
import { StarIcon } from '@heroicons/react/20/solid'

const product = {
    name: 'Basic Tee 6-Pack',
    price: '$192',
    href: '#',
    breadcrumbs: [
        { id: 1, name: 'Men', href: '#' },
        { id: 2, name: 'Clothing', href: '#' },
    ],
    images: [
        {
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
            alt: 'Two each of gray, white, and black shirts laying flat.',
        },
        {
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
            alt: 'Model wearing plain black basic tee.',
        },
        {
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
            alt: 'Model wearing plain gray basic tee.',
        },
        {
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
            alt: 'Model wearing plain white basic tee.',
        },
    ],
    colors: [
        { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
        { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
        { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
    ],
    sizes: [
        { name: 'XXS', inStock: false },
        { name: 'XS', inStock: true },
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
        { name: '2XL', inStock: true },
        { name: '3XL', inStock: true },
    ],
    description:
        'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
    highlights: [
        'Hand cut and sewn locally',
        'Dyed with our proprietary colors',
        'Pre-washed & pre-shrunk',
        'Ultra-soft 100% cotton',
    ],
    details:
        'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const products = [
    {
        id: '1',
        name: 'Earthen Bottle',
        price: '$48',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Home', href: '#' },
            { id: 2, name: 'Kitchen', href: '#' },
        ],
        images: [
            {
                src: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
                alt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
            },
        ],
        colors: [
            { name: 'Clay', class: 'bg-brown-500', selectedClass: 'ring-brown-500' },
        ],
        sizes: [
            { name: 'One Size', inStock: true },
        ],
        description: 'A beautifully crafted earthen bottle perfect for storing liquids or as a decorative piece.',
        highlights: [
            'Handcrafted',
            'Natural clay',
            'Cork stopper included',
        ],
        details: 'This earthen bottle is made from high-quality porcelain and features a natural clay textured body. It is perfect for adding a rustic touch to your kitchen or dining area.',
    },
    {
        id: '2',
        name: 'Nomad Tumbler',
        price: '$35',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Home', href: '#' },
            { id: 2, name: 'Kitchen', href: '#' },
        ],
        images: [
            {
                src: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
                alt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
            },
        ],
        colors: [
            { name: 'Olive Green', class: 'bg-green-500', selectedClass: 'ring-green-500' },
        ],
        sizes: [
            { name: 'One Size', inStock: true },
        ],
        description: 'Keep your drinks hot or cold with the Nomad Tumbler, a stylish and practical insulated bottle.',
        highlights: [
            'Insulated',
            'Durable',
            'Screw lid',
        ],
        details: 'The Nomad Tumbler is perfect for on-the-go use. It keeps your drinks at the perfect temperature for hours and features a flared screw lid for easy opening.',
    },
    {
        id: '3',
        name: 'Focus Paper Refill',
        price: '$89',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Office', href: '#' },
            { id: 2, name: 'Supplies', href: '#' },
        ],
        images: [
            {
                src: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
                alt: 'Person using a pen to cross a task off a productivity paper card.',
            },
        ],
        colors: [
            { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
        ],
        sizes: [
            { name: 'One Size', inStock: true },
        ],
        description: 'Stay organized and productive with these high-quality focus paper refills.',
        highlights: [
            'Productivity focused',
            'High-quality paper',
            'Perfect for planners',
        ],
        details: 'These paper refills are designed to help you stay organized and productive. The high-quality paper ensures smooth writing and durability.',
    },
    {
        id: '4',
        name: 'Machined Mechanical Pencil',
        price: '$35',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Office', href: '#' },
            { id: 2, name: 'Supplies', href: '#' },
        ],
        images: [
            {
                src: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
                alt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
            },
        ],
        colors: [
            { name: 'Black', class: 'bg-black', selectedClass: 'ring-black' },
        ],
        sizes: [
            { name: 'One Size', inStock: true },
        ],
        description: 'Experience the precision and durability of our machined mechanical pencil.',
        highlights: [
            'Precision engineering',
            'Durable materials',
            'Elegant design',
        ],
        details: 'This mechanical pencil is made from high-quality machined steel and features a brass tip and top. It is perfect for detailed work and everyday writing.',
    },
    {
        id: '5',
        name: 'T-Shirt Coton',
        price: '$110',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Clothing', href: '#' },
            { id: 2, name: 'T-Shirts', href: '#' },
        ],
        images: [
            {
                src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
                alt: 'Coton Tshirt.',
            },
        ],
        colors: [
            { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
        ],
        sizes: [
            { name: 'S', inStock: true },
            { name: 'M', inStock: true },
            { name: 'L', inStock: true },
            { name: 'XL', inStock: true },
        ],
        description: 'A classic cotton t-shirt, perfect for any occasion.',
        highlights: [
            '100% cotton',
            'Soft and comfortable',
            'Durable',
        ],
        details: 'This cotton t-shirt is made from 100% high-quality cotton. It is soft, comfortable, and durable, making it perfect for everyday wear.',
    },
    {
        id: '6',
        name: 'Rose Petals Divine',
        price: '$120',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Beauty', href: '#' },
            { id: 2, name: 'Perfume', href: '#' },
        ],
        images: [
            {
                src: 'https://pagedone.io/asset/uploads/1701162850.png',
                alt: 'Perfume Pinky.',
            },
        ],
        colors: [
            { name: 'Pink', class: 'bg-pink-500', selectedClass: 'ring-pink-500' },
        ],
        sizes: [
            { name: 'One Size', inStock: true },
        ],
        description: 'A luxurious perfume with the essence of rose petals.',
        highlights: [
            'Luxurious fragrance',
            'Long-lasting',
            'Elegant bottle',
        ],
        details: 'Rose Petals Divine is a luxurious perfume that captures the essence of fresh rose petals. It is long-lasting and comes in an elegant bottle.',
    },
    {
        id: '7',
        name: 'Musk Rose Cooper',
        price: '$120',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Beauty', href: '#' },
            { id: 2, name: 'Perfume', href: '#' },
        ],
        images: [
            {
                src: 'https://pagedone.io/asset/uploads/1701162866.png',
                alt: 'Person using a pen to cross a task off a productivity paper card.',
            },
        ],
        colors: [
            { name: 'Rose Gold', class: 'bg-rose-500', selectedClass: 'ring-rose-500' },
        ],
        sizes: [
            { name: 'One Size', inStock: true },
        ],
        description: 'Experience the captivating scent of Musk Rose Cooper.',
        highlights: [
            'Captivating fragrance',
            'Elegant packaging',
            'Long-lasting',
        ],
        details: 'Musk Rose Cooper offers a captivating fragrance that is perfect for any occasion. It comes in an elegantly designed bottle and lasts all day.',
    },
    {
        id: '8',
        name: 'Dusk Dark Hue',
        price: '$120',
        href: '#',
        breadcrumbs: [
            { id: 1, name: 'Beauty', href: '#' },
            { id: 2, name: 'Perfume', href: '#' },
        ],
        images: [
            {
                src: 'https://pagedone.io/asset/uploads/1701162880.png',
                alt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
            },
        ],
        colors: [
            { name: 'Dark', class: 'bg-black', selectedClass: 'ring-black' },
        ],
        sizes: [
            { name: 'One Size', inStock: true },
        ],
        description: 'A bold and intense fragrance perfect for evening wear.',
        highlights: [
            'Bold fragrance',
            'Perfect for evenings',
            'Elegant bottle',
        ],
        details: 'Dusk Dark Hue is a bold and intense fragrance that is perfect for evening wear. It comes in an elegantly designed bottle and provides a long-lasting scent.',
    },
];


interface Breadcrumb {
    id: number;
    name: string;
    href: string;
}

interface Image {
    src: string;
    alt: string;
}

interface Color {
    name: string;
    class: string;
    selectedClass: string;
}

interface Size {
    name: string;
    inStock: boolean;
}

interface Product {
    id: string;
    name: string;
    price: string;
    href: string;
    breadcrumbs: Breadcrumb[];
    images: Image[];
    colors: Color[];
    sizes: Size[];
    description: string;
    highlights: string[];
    details: string;
}


const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const [selectedColor, setSelectedColor] = useState(product.colors[0])
    const [selectedSize, setSelectedSize] = useState(product.sizes[0])
    const [selectedId, setselectedId] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        console.log(localStorage.getItem('cart'));
        const id = searchParams.get('productId');
        console.log(id);
        setselectedId(id);
        const productSelected = products.find((product) => product.id == id);
        setSelectedProduct(productSelected || products[0]);
        console.log(productSelected);
    }, []);

    useEffect(() => {
        console.log(selectedProduct.breadcrumbs);
    }, [selectedProduct]); 
    
    const addToCart = () => {
        console.log(localStorage.getItem('cart'));
        var quantity = 1;
        if (typeof window !== 'undefined') {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(item => item.productId === selectedProduct.id);
                        
            if (existingItemIndex >= 0) {
                cart[existingItemIndex].quantity += quantity;
                cart[existingItemIndex].total = '$' + (parseInt(cart[existingItemIndex].price.replace('$', '')) * cart[existingItemIndex].quantity).toString();
            } else {
                const intPrice = parseInt(selectedProduct.price.replace('$', ''));
                const intTotal = quantity * intPrice;
                const total = '$' + intTotal.toString();
                cart.push({productId: selectedProduct.id, quantity, price: selectedProduct.price, total, name: selectedProduct.name, image: selectedProduct.images[0].src});
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        console.log(localStorage.getItem('cart'));

        router.push('/shopping_cart');
    };

    

    return (
        <div className="bg-white">
            <div className="pt-6">
                <nav aria-label="Breadcrumb">
                    <ol role="list" className="mx-auto flex justify-between max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <div className='flex'>
                            <button className="mr-5" type="button">
                                <Link href="./catalogue">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                                    </svg>
                                </Link>
                            </button>
                            {selectedProduct.breadcrumbs.map((breadcrumb) => (
                                <li key={breadcrumb.id}>
                                    <div className="flex items-center">
                                        <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                                            {breadcrumb.name}
                                        </a>
                                        <svg
                                            width={16}
                                            height={20}
                                            viewBox="0 0 16 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                            className="h-5 w-4 text-gray-300"
                                        >
                                            <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                        </svg>
                                    </div>
                                </li>
                            ))}
                            <li className="text-sm">
                                <a href={selectedProduct.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                                    {selectedProduct.name}
                                </a>
                            </li></div>
                        <button className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-900 hover:bg-blue-500/10 active:bg-blue-700/30 flex items-center gap-4 px-4 capitalize" type="button">
                            <Link href="./shopping_cart">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </Link>
                        </button>

                    </ol>
                </nav>

                {/* Image gallery */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8 justify-items-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>


                    <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                        <img
                            src={selectedProduct.images[0].src}
                            alt={selectedProduct.images[0].alt}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </div>

                {/* Product info */}
                <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{selectedProduct.name}</h1>
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">{selectedProduct.price}</p>

                        {/* Reviews */}
                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            className={classNames(
                                                reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0',
                                            )}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{reviews.average} out of 5 stars</p>
                                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    {reviews.totalCount} reviews
                                </a>
                            </div>
                        </div>

                        <form className="mt-10">
                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                                <fieldset aria-label="Choose a color" className="mt-4">
                                    <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center space-x-3">
                                        {selectedProduct.colors.map((color) => (
                                            <Radio
                                                key={color.name}
                                                value={color}
                                                aria-label={color.name}
                                                className={({ focus, checked }) =>
                                                    classNames(
                                                        color.selectedClass,
                                                        focus && checked ? 'ring ring-offset-1' : '',
                                                        !focus && checked ? 'ring-2' : '',
                                                        'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                                                    )
                                                }
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        color.class,
                                                        'h-8 w-8 rounded-full border border-black border-opacity-10',
                                                    )}
                                                />
                                            </Radio>
                                        ))}
                                    </RadioGroup>
                                </fieldset>
                            </div>

                            {/* Sizes */}
                            <div className="mt-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        Size guide
                                    </a>
                                </div>

                                <fieldset aria-label="Choose a size" className="mt-4">
                                    <RadioGroup
                                        value={selectedSize}
                                        onChange={setSelectedSize}
                                        className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                                    >
                                        {selectedProduct.sizes.map((size) => (
                                            <Radio
                                                key={size.name}
                                                value={size}
                                                disabled={!size.inStock}
                                                className={({ focus }) =>
                                                    classNames(
                                                        size.inStock
                                                            ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                            : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                        focus ? 'ring-2 ring-indigo-500' : '',
                                                        'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                                                    )
                                                }
                                            >
                                                {({ checked, focus }) => (
                                                    <>
                                                        <span>{size.name}</span>
                                                        {size.inStock ? (
                                                            <span
                                                                className={classNames(
                                                                    checked ? 'border-indigo-500' : 'border-transparent',
                                                                    focus ? 'border' : 'border-2',
                                                                    'pointer-events-none absolute -inset-px rounded-md',
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <span
                                                                aria-hidden="true"
                                                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                            >
                                                                <svg
                                                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                                    viewBox="0 0 100 100"
                                                                    preserveAspectRatio="none"
                                                                    stroke="currentColor"
                                                                >
                                                                    <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Radio>
                                        ))}
                                    </RadioGroup>
                                </fieldset>
                            </div>

                            <button
                                onClick={() => addToCart()}
                                type="submit"
                                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add to bag
                            </button>
                        </form>
                    </div>

                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                        {/* Description and details */}
                        <div>
                            <h3 className="sr-only">Description</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{selectedProduct.description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

                            <div className="mt-4">
                                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                                    {selectedProduct.highlights.map((highlight) => (
                                        <li key={highlight} className="text-gray-400">
                                            <span className="text-gray-600">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Details</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">{selectedProduct.details}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
