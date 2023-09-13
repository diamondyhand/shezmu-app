import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Stack } from '@mui/material';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}


export default function SocialLinkDropDown() {
  return (
    <>
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className='cursor-pointer text-white font-bold fontSize-[14px] items-center flex gap-x-1.5'>
          Socials
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-white" aria-hidden="true" />
        </Menu.Button>    
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-[#18181B] border border-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">           
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://t.me/shezmueth"
                  target='_blank'
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-white',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Telegram
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://twitter.com/ShezmuTech"
                  target='_blank'
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-white',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Twitter
                </a>
              )}
            </Menu.Item>
            <form method="POST" action="#">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href='https://shezmu.gitbook.io/shezmu/introduction/welcome-to-shezmu'
                    target='_blank'
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-white',
                      'block w-full px-4 py-2 text-left text-sm'
                    )}
                  >
                    Gitbook
                  </a>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
    </>
  )
}
