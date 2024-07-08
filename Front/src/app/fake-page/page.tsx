"use client"

import { Fragment, useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../logo.png'
import Image from "next/image";
import Link from 'next/link';

const navigation = {
    categories: [
        {
            id: 'women',
            name: 'Women',
            featured: [
                {
                    id: 'women-featured-1',
                    name: 'New Arrivals',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
                    imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
                },
                {
                    id: 'women-featured-2',
                    name: 'Basic Tees',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
                    imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
                },
            ],
            sections: [
                {
                    id: 'women-clothing',
                    name: 'Clothing',
                    items: [
                        { id: 'women-tops', name: 'Tops', href: '#' },
                        { id: 'women-dresses', name: 'Dresses', href: '#' },
                        { id: 'women-pants', name: 'Pants', href: '#' },
                        { id: 'women-denim', name: 'Denim', href: '#' },
                        { id: 'women-sweaters', name: 'Sweaters', href: '#' },
                        { id: 'women-t-shirts', name: 'T-Shirts', href: '#' },
                        { id: 'women-jackets', name: 'Jackets', href: '#' },
                        { id: 'women-activewear', name: 'Activewear', href: '#' },
                        { id: 'women-browse-all', name: 'Browse All', href: '#' },
                    ],
                },
                {
                    id: 'women-accessories',
                    name: 'Accessories',
                    items: [
                        { id: 'women-watches', name: 'Watches', href: '#' },
                        { id: 'women-wallets', name: 'Wallets', href: '#' },
                        { id: 'women-bags', name: 'Bags', href: '#' },
                        { id: 'women-sunglasses', name: 'Sunglasses', href: '#' },
                        { id: 'women-hats', name: 'Hats', href: '#' },
                        { id: 'women-belts', name: 'Belts', href: '#' },
                    ],
                },
                {
                    id: 'women-brands',
                    name: 'Brands',
                    items: [
                        { id: 'women-brand-1', name: 'Full Nelson', href: '#' },
                        { id: 'women-brand-2', name: 'My Way', href: '#' },
                        { id: 'women-brand-3', name: 'Re-Arranged', href: '#' },
                        { id: 'women-brand-4', name: 'Counterfeit', href: '#' },
                        { id: 'women-brand-5', name: 'Significant Other', href: '#' },
                    ],
                },
            ],
        },
        {
            id: 'men',
            name: 'Men',
            featured: [
                {
                    id: 'men-featured-1',
                    name: 'New Arrivals',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
                    imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
                },
                {
                    id: 'men-featured-2',
                    name: 'Artwork Tees',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg',
                    imageAlt:
                        'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
                },
            ],
            sections: [
                {
                    id: 'men-clothing',
                    name: 'Clothing',
                    items: [
                        { id: 'men-tops', name: 'Tops', href: '#' },
                        { id: 'men-pants', name: 'Pants', href: '#' },
                        { id: 'men-sweaters', name: 'Sweaters', href: '#' },
                        { id: 'men-t-shirts', name: 'T-Shirts', href: '#' },
                        { id: 'men-jackets', name: 'Jackets', href: '#' },
                        { id: 'men-activewear', name: 'Activewear', href: '#' },
                        { id: 'men-browse-all', name: 'Browse All', href: '#' },
                    ],
                },
                {
                    id: 'men-accessories',
                    name: 'Accessories',
                    items: [
                        { id: 'men-watches', name: 'Watches', href: '#' },
                        { id: 'men-wallets', name: 'Wallets', href: '#' },
                        { id: 'men-bags', name: 'Bags', href: '#' },
                        { id: 'men-sunglasses', name: 'Sunglasses', href: '#' },
                        { id: 'men-hats', name: 'Hats', href: '#' },
                        { id: 'men-belts', name: 'Belts', href: '#' },
                    ],
                },
                {
                    id: 'men-brands',
                    name: 'Brands',
                    items: [
                        { id: 'men-brand-1', name: 'Re-Arranged', href: '#' },
                        { id: 'men-brand-2', name: 'Counterfeit', href: '#' },
                        { id: 'men-brand-3', name: 'Full Nelson', href: '#' },
                        { id: 'men-brand-4', name: 'My Way', href: '#' },
                    ],
                },
            ],
        },
    ],
    pages: [
        { id: 'company', name: 'Company', href: '#' },
        { id: 'stores', name: 'Stores', href: '#' },
    ],
};


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}


const sendEventToKafka = async (event: string, data: any) => {
    try {
        await fetch('/api/kafka', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event, data }),
        });
    } catch (error) {
        console.error('Failed to send event to Kafka:', error);
    }
};



export default function Example() {
    const [open, setOpen] = useState(false)

    
    function navPage(idProduct: string | number) {
        sendEventToKafka('navPage', { productId: idProduct });

    }


    return (
        <div className="bg-white">
            <header className="relative bg-white">
                <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center">
                            <button
                                type="button"
                                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                                onClick={() => setOpen(true)}
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Logo */}
                            <div className="ml-4 flex lg:ml-0">
                                <a href="#">
                                    <span className="sr-only">Your Company</span>
                                    <Image
                                        src={logo}
                                        className="h-8 w-auto rounded-2xl"
                                        alt=""
                                    />
                                </a>
                            </div>

                            {/* Flyout menus */}
                            <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                                <div className="flex h-full space-x-8">
                                    {navigation.categories.map((category) => (
                                        <Popover key={category.name} className="flex">
                                            {({ open }) => (
                                                <>
                                                    <div className="relative flex">
                                                        <PopoverButton
                                                            className={classNames(
                                                                open
                                                                    ? 'border-indigo-600 text-indigo-600'
                                                                    : 'border-transparent text-gray-700 hover:text-gray-800',
                                                                'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out',
                                                            )}
                                                        >
                                                            {category.name}
                                                        </PopoverButton>
                                                    </div>

                                                    <PopoverPanel
                                                        transition
                                                        className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                                                    >
                                                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                                        <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                                                        <div className="relative bg-white">
                                                            <div className="mx-auto max-w-7xl px-8">
                                                                <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                                                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                                                        {category.sections.map((section) => (
                                                                            <div key={section.name}>
                                                                                <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                                                                    {section.name}
                                                                                </p>
                                                                                <ul
                                                                                    role="list"
                                                                                    aria-labelledby={`${section.name}-heading`}
                                                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                                                >
                                                                                    {section.items.map((item) => (
                                                                                        <li key={item.name} className="flex">
                                                                                            <Link href="./fake-page" onClick={() => navPage(item.id)}>
                                                                                            <div className="hover:text-gray-800">
                                                                                                {item.name}
                                                                                            </div></Link>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </PopoverPanel>
                                                </>
                                            )}
                                        </Popover>
                                    ))}

                                    {navigation.pages.map((page) => (
                                        <a
                                            key={page.name}
                                            onClick={() => navPage(page.id)}
                                            href={page.href}
                                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            {page.name}
                                        </a>
                                    ))}
                                </div>
                            </PopoverGroup>

                            <div className="ml-auto flex items-center">
                                {/* Search */}
                                <div className="flex lg:ml-6">
                                    <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Search</span>
                                        <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                                    </a>
                                </div>

                                {/* Cart */}
                                <div className="ml-4 flow-root lg:ml-6">
                                    <a href="#" className="group -m-2 flex items-center p-2">
                                        <ShoppingBagIcon
                                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                                        <span className="sr-only">items in cart, view bag</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div className='flex justify-center items-center w-full h-full flex-col'>
                <p className='pt-52 text-center'>This page only exists for statistic gathering purposes. <br />To consult our list of products, please click on the button below</p> 
                <Link href="./catalogue"><button
                    className="mt-10 tracking-wide font-semibold bg-gradient-to-tl from-blue-500 to-teal-500 text-gray-100 w-25 py-4 rounded-lg hover:bg-gradient-to-tr from-blue-500 to-indigo-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                       
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit ml-5">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                    </svg>
                    <span className="w-20 mr-3">
                        Home
                    </span> 
                </button></Link>
            </div>
        </div>
    )
}